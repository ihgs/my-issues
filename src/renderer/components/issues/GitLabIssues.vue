<template>
  <div>
    {{config.name}}
    <b-list-group>
      <b-list-group-item v-for="issue in issues" v-bind:key="issue.id" >
        <div class="d-flex w-100 justify-content-between">
          <div>
            <b-link @click="open(issue.url)">{{issue.subject}}</b-link>
            @{{issue.project}}
          </div>
          <small v-if="issue.due_date">~ {{issue.due_date}}</small>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GitlabPage',
  props: ['config'],
  data () {
    return {
      issues: []
    }
  },
  mounted: function () {
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
    const url = `${this.config.url}/api/v4/issues?assignee_id=${this.config.userid}&state=opened&private_token=${this.config.token}`
    axios.get(url, headers)
      .then(response => {
        response.data.forEach(issue => {
          console.log(issue)
          this.issues.push(
            {
              'subject': issue.title,
              'url': issue.web_url,
              'due_date': issue.due_date,
              'project': this.project(issue.web_url)
            }
          )
        })
      })
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    project (url) {
      return url.split('/').slice(-4, -2).join('/')
    }
  }
}
</script>

<style>

</style>
