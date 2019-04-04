<template>
  <div>
    <div class="d-flex w-100 justify-content-between">
      {{config.name}}
      <div>
        <b-spinner v-if="loading" small label="Spinning"></b-spinner>
        <font-awesome-icon v-else icon="redo" @click="load()"/>
      </div>
    </div>
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
      issues: [],
      loading: true
    }
  },
  mounted: function () {
    this.load()
  },
  methods: {
    load () {
      this.issues = []
      this.loading = true
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
      const url = `${this.config.url}/api/v4/issues?assignee_id=${this.config.userid}&state=opened&private_token=${this.config.token}`
      axios.get(url, headers)
        .then(response => {
          this.loading = false
          response.data.forEach(issue => {
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