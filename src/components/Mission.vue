<template>
  <div class="mission" :class="[{ active: isActive }, mission.status]">
    <div class="name">
      <h1>{{ $t('mission.label') }} // {{ mission.slug }}</h1>
      <h2>{{ mission.name }}</h2>
    </div>
    <div class="status" :class="mission.status">{{ missionStatus }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    mission: {
      type: Object,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
  },
  computed: {
    icon() {
      return `/icons/mission-${this.mission.status}.svg`;
    },
    missionStatus() {
      if (this.mission.status === "start") return this.$t('mission.status.briefing');
      if (this.mission.status === "partial-success") return this.$t('mission.status.partial');
      if (this.mission.status === "success") return this.$t('mission.status.success');
      if (this.mission.status === "failure") return this.$t('mission.status.failure');
    },
    isActive() {
      return this.mission.slug === this.selected;
    },
  },
};
</script>
