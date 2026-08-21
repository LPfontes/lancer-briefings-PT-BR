<template>
  <nav class="mobile-bottom-nav">
    <router-link to="/status" id="mobile-nav-status">
      <img src="/icons/orbital.svg" alt="Status" />
      <span>{{ $t('sidebar.status') }}</span>
    </router-link>
    <router-link to="/pilots" id="mobile-nav-pilots">
      <img src="/icons/pilot.svg" alt="Pilotos" />
      <span>{{ $t('sidebar.pilots') }}</span>
    </router-link>
    <router-link to="/hangar" id="mobile-nav-hangar">
      <img src="/icons/deployable.svg" alt="Hangar" />
      <span>{{ $t('sidebar.hangar') }}</span>
    </router-link>
    <router-link to="/events" id="mobile-nav-events">
      <img src="/icons/events.svg" alt="Logs" />
      <span>{{ $t('sidebar.logs') }}</span>
    </router-link>
    <router-link to="/glossary" id="mobile-nav-glossary">
      <img src="/icons/protocol.svg" alt="Glossário" />
      <span>{{ $t('sidebar.glossary') }}</span>
    </router-link>
    <router-link to="/history" id="mobile-nav-history">
      <img src="/icons/calendar.svg" alt="História" />
      <span>{{ $t('sidebar.history') }}</span>
    </router-link>
    <router-link to="/report" id="mobile-nav-report">
      <img src="/icons/campaign.svg" alt="Relatório" />
      <span>{{ $t('sidebar.missionReport') }}</span>
    </router-link>
    <router-link to="/personas" id="mobile-nav-personas">
      <img src="/icons/pilot.svg" alt="Personas" />
      <span>{{ $t('sidebar.personas') }}</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: "MobileNav",
};
</script>
