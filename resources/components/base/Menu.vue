<template>
<v-navigation-drawer class="deep-purple accent-4" dark permanent app floating>
    <v-list-item>
    <v-list-item-content>
        <v-list-item-title class="title">
        Application
        </v-list-item-title>
        <v-list-item-subtitle>
        subtext
        </v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list
    dense
    nav
    >
    <v-list-item
        v-for="item in items"
        :key="item.title"
        link 
        :to="item.href"
    >
        <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
    </v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', href:'/' },
          { title: 'Photos', icon: 'mdi-image', href:'/photo' },
          { title: 'Tables', icon: 'mdi-table', href:'/table' },
          { title: 'About', icon: 'mdi-help-box', href:'/about' },
        ],
        right: null,
      }
    },
  }
</script>