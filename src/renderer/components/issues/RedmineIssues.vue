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
      <b-list-group-item v-for="issue in issues" v-bind:key="issue.id">
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
  name: 'IssuePage',
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
      this.loading = true
      this.issues = []
      const defaultQuery = {
        'assigned_to_id': 'me',
        'key': this.config.token
      }
      const config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        params: Object.assign(defaultQuery, this.config.query)
      }
      const url = `${this.config.url}/issues.json`
      axios.get(url, config)
        .then(response => {
          this.loading = false
          response.data.issues.forEach(issue => {
            this.issues.push(
              {
                'subject': issue.subject,
                'url': `${this.config.url}/issues/${issue.id}`,
                'project': issue.project.name,
                'due_date': issue.due_date
              }
            )
          })
        })
    },
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>

</style>
