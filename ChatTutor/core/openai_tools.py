import os
import openai
from nice_functions import *

def simple_gpt(system_message, user_message):
    models_to_try = ["gpt-3.5-turbo-16k", "gpt-3.5-turbo"]
    for model_to_try in models_to_try:
        try:
            response = openai.ChatCompletion.create(
                model=model_to_try,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message},
                ],
                temperature=1,
                frequency_penalty=0.0,
                presence_penalty=0.0,
                # stream=True,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(red(model_to_try), "FAILED!")
            if model_to_try == models_to_try[-1]: raise(e)


def load_api_keys():
    if "CHATTUTOR_GCP" in os.environ or "_CHATUTOR_GCP" in os.environ:
        openai.api_key = os.environ["OPENAI_API_KEY"]
    else:
        import yaml

        with open(".env.yaml") as f:
            yamlenv = yaml.safe_load(f)
        keys = yamlenv["env_variables"]
        os.environ["OPENAI_API_KEY"] = keys["OPENAI_API_KEY"]
        openai.api_key = keys["OPENAI_API_KEY"]
        os.environ["ACTIVELOOP_TOKEN"] = keys["ACTIVELOOP_TOKEN"]