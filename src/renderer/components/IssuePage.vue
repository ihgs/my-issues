<template>
  <div>
    <b-alert show dismissible fade v-if="errorMsg" variant="danger">
      {{errorMsg}}
    </b-alert>
    <b-list-group>
      <b-list-group-item v-for="(config, index) in configJson" :key="index">
        <div v-if="config.type === 'redmine'">
          <redmine-issues :config="config"></redmine-issues>
        </div>
        <div v-else-if="config.type === 'gitlab'">
          <gitlab-issues :config="config"></gitlab-issues>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import fs from 'fs'
import path from 'path'
import RedmineIssues from './issues/RedmineIssues'
import GitlabIssues from './issues/GitLabIssues'
import { remote } from 'electron'

export default {
  name: 'IssuePage',
  components: {
    'redmine-issues': RedmineIssues,
    'gitlab-issues': GitlabIssues
  },
  data () {
    return {
      configJson: [],
      errorMsg: ''
    }
  },
  created: function () {
    const configPath = path.join(remote.app.getPath('home'), '.myissue.json')
    try {
      const data = fs.readFileSync(configPath, {encoding: 'utf-8'})
      this.configJson = JSON.parse(data)
    } catch (err) {
      this.errorMsg = err
    }
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
