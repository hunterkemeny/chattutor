from threading import Thread
from time import sleep
from nice_functions import *
import background.commands as commands
from queue import Queue

queue_total = 0
queue_completed = 0
bg_queue = Queue()

def increase_completed():
    global queue_completed
    queue_completed+=1

def get_total():
    return queue_total
def get_completed():
    return queue_completed
def get_remaining():
    return get_total()-get_completed()
def get_progress():
    return [get_completed(), get_total()]

def add_to_queue(command, args, comment="", id=""):
    global queue_total, queue_completed
    
    queue_total = bg_queue.qsize()+1
    queue_completed = 0

    bg_queue.put_nowait({ 
        "command":  command,
        "args":     args,
        "comment":  comment,
    })        
    
def add_texts_to_collection(collection_name,texts):
    comment = rf"add_texts_to_collection, {collection_name}, {len(texts)}"
    divide_task_in = 20
    total = len(texts)
    while  reversed(texts):
        texts_to_add = []
        for i in range(divide_task_in):
            if not texts: break
            texts_to_add.append(texts.pop(0))
        if not texts_to_add: break
        print(rf"adding {len(texts_to_add)} ({texts_to_add[0].chunk}/{total}) ")
        comment = rf"add_texts_to_collection, {collection_name}, ({texts_to_add[0].chunk}/{total})"
        add_to_queue(
            comment=comment,
            command=commands.add_texts_to_collection,
            args={
                "collection_name": collection_name,
                "texts": texts_to_add
            },
        )
    

def loop():
    while True:
        if not bg_queue.empty():
            item = bg_queue.get_nowait()
            command =       item.get("command", None)
            args =          item.get("args", None)
            comment =       item.get("comment", None)
            pprint(f"running queue... {get_completed()}/{get_total()} to go")
            if comment:
                pprint(blue(comment))
            for i_attempt in range(3):
                try:
                    command(**args)
                    break
                except Exception as e:
                    if i_attempt == 2:
                        print("--- error ---")
                        import traceback
                        traceback.print_exc() 
                        sleep(1)
            increase_completed()
        sleep(5)  # TODO poll other things

Thread(target=loop, daemon=True).start()

