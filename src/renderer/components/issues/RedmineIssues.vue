<template>
  <div>
    {{config.name}}
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
      issues: []
    }
  },
  mounted: function () {
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    }
    const url = `${this.config.url}/issues.json?assigned_to_id=me&key=${this.config.token}`
    axios.get(url, headers)
      .then(response => {
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
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>

</style>
