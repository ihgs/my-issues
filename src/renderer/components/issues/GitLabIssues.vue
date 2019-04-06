<template>
  <div>
    <div class="d-flex w-100 justify-content-between">
      {{config.name}}
      <div>
        <b-spinner v-if="loading" small label="Spinning"></b-spinner>
        <font-awesome-icon v-else icon="redo" @click="load()"/>
      </div>
    </div>
    <b-alert show dismissible fade v-if="errorMsg" variant="danger">
      {{errorMsg}}
    </b-alert>
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
      loading: true,
      errorMsg: ''
    }
  },
  mounted: function () {
    this.loadUserId().then(() => {
      this.load()
    })
      .catch(error => {
        this.setErrorMsg(error)
      })
  },
  methods: {
    async loadUserId () {
      const url = `${this.config.url}/api/v4/user`
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Private-Token': this.config.token
        },
        data: {}
      }
      const response = await axios.get(url, config)
      this.authenticatedUserId = response.data.id
    },
    setErrorMsg (error) {
      this.errorMsg = error
      this.loading = false
    },
    load () {
      this.issues = []
      this.loading = true
      this.errorMsg = ''
      const defaultQuery = {
        'assignee_id': this.authenticatedUserId,
        'state': 'opened'
      }
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Private-Token': this.config.token
        },
        params: Object.assign(defaultQuery, this.config.query)
      }
      const url = `${this.config.url}/api/v4/issues`
      axios.get(url, config)
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
        .catch(error => {
          this.setErrorMsg(error)
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
