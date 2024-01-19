import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Processes} from "../models/processing.model";

@Component({
    selector: 'app-course-dashboard',
    templateUrl: './course-dashboard.component.html',
    styleUrls: ['./course-dashboard.component.css']
})
export class CourseDashboardComponent implements OnInit {
    course_id: string | null
    sections: any = []
    username: string
    process_of: any = {}
    course_name: string = '[]'
    loading: boolean = true
    status: String = 'content'
    testmode: boolean = false
    runlocally: boolean = false
    tokens: any[] = []
    constructor(private route: ActivatedRoute) {
    }

    switchStatus(newstatus : String) : void {
        this.status = newstatus
    }

    ngOnInit(): void {
        this.loading = true
        console.log(this.route.snapshot.paramMap)
        this.course_id = this.route.snapshot.paramMap.get('id')
        console.log(this.course_id)
        fetch('/getuser', {method: 'POST', headers: {'Content-Type': 'application/json'}}).then(res => res.json())
            .then(user => {
                this.username = user['username']
                fetch(`/users/${this.username}/courses/${this.course_id}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                }).then(
                    resp => resp.json()
                ).then(data => {
                    this.sections = data["sections"]
                    this.course_name = this.sections[0]['course_chroma_collection']
                    console.log('sections:',this.sections)
                    this.loading = false
                })

                fetch(`/course/${this.course_id}/gettokens`, {method: 'POST', headers: {'Content-Type': 'application/json'}}).then(res => res.json())
                .then(toks => {
                    this.tokens = toks
                })
            })


    }


    getStatus(doc: string) {
        if (this.process_of[doc] == null)
            return Processes.Idle
        return this.process_of[doc]
    }

    statusDel(section: any) : boolean {
        if (section == undefined)
            return true
        return this.getStatus(section['section_id']) == Processes.Deleting
    }

    async removeFromCollection(d: any) {
        let doc= d.doc
        let collection = d.collection
        let data = JSON.stringify({
            collection: collection,
            doc: doc
        })
        this.process_of[d.doc] = Processes.Deleting
        let response = await fetch('/delete_doc', {method: 'POST', headers:{'Content-Type':'application/json'}, body: data})
        const deleted_data = await response.json()

        console.log(deleted_data['deleted'])

        this.sections = this.sections.filter((s:any) => {
            console.log(s['section_id'], deleted_data['deleted'])
            return s['section_id'] != deleted_data['deleted']
        })

        console.log("Removed from db")
    }

}
