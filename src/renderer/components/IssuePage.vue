<template>
  <div>
    <ul>
      <li v-for="issue in issues" v-bind:key="issue.id">
        <div class="alt" @click="open(issue.url)">{{issue.subject}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import fs from 'fs'
import path from 'path'

export default {
  name: 'IssuePage',
  data () {
    return {
      configJson: [],
      issues: []
    }
  },
  created: function () {
    const configPath = path.join(__dirname, '../../..', 'myissue.json')
    const data = fs.readFileSync(configPath, {encoding: 'utf-8'})
    this.configJson = JSON.parse(data)
  },
  mounted: function () {
    this.configJson.forEach(target => {
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
      const url = `${target.url}/issues.json?assigned_to_id=me&key=${target.token}`
      axios.get(url, headers)
        .then(response => {
          response.data.issues.forEach(issue => {
            this.issues.push(
              {
                'subject': issue.subject,
                'url': `${target.url}/issues/${issue.id}`
              }
            )
          })
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
