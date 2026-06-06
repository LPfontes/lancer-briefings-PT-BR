<template>
	<div class="page-wrapper">
		<Header 
			:planet-path="planetPath" 
			:class="{ animate: animate }" 
			:header="header" 
			@open-encrypted="encryptedModalOpen = true" 
			@open-notification="showSampleNotification"
		/>
		<Sidebar :animate="animate" :class="{ animate: animate }" />
	</div>
	<MobileNav />
	<div id="router-view-container">
		<router-view :animate="animate" :initial-slug="initialSlug" :missions="missions" :reports="reports" :personas="personas" :events="events"
			:pilots="pilots" :clocks="clocks" :reserves="reserves" />
	</div>

	<EncryptedMessageModal :is-open="encryptedModalOpen" @close="encryptedModalOpen = false" />
	
	<NotificationModal 
		:is-open="notification.isOpen" 
		:title="notification.title" 
		:message="notification.message" 
		:type="notification.type"
		@close="notification.isOpen = false" 
	/>

	<svg style="visibility: hidden; position: absolute" width="0" height="0" xmlns="http://www.w3.org/2000/svg"
		version="1.1">
		<defs>
			<filter id="round">
				<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
				<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -5"
					result="goo" />
				<feComposite in="SourceGraphic" in2="goo" operator="atop" />
			</filter>
		</defs>
	</svg>

</template>

<script>
import Header from "./components/layout/Header.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import MobileNav from "./components/layout/MobileNav.vue";
import EncryptedMessageModal from "./components/modals/EncryptedMessageModal.vue";
import NotificationModal from "./components/modals/NotificationModal.vue";
import Config from "@/assets/info/general-config.json";
import { pilotStore } from "@/store/pilotCreator";

export default {
	components: {
		Header,
		Sidebar,
		MobileNav,
		EncryptedMessageModal,
		NotificationModal,
	},

	data() {
		return {
			animate: Config.animate,
			initialSlug: Config.initialSlug,
			planetPath: Config.planetPath,
			header: { ...Config.header, icon: Config.icon },
			pilotSpecialInfo: Config.pilotSpecialInfo,
			encryptedModalOpen: false,
			notification: {
				isOpen: false,
				title: "",
				message: "",
				type: "info"
			},
			clocks: [],
			events: [],
			missions: [],
			reports: [],
			personas: [],
			pilots: [],
			reserves: [],
			bonds: [],
		};
	},
	created() {
		this.setTitleFavicon(Config.defaultTitle + " MISSION BRIEFING", Config.icon);
		this.importMissions(import.meta.glob("@/assets/missions/*.md", { query: '?raw', import: 'default' }));
		this.importReports(import.meta.glob("@/assets/reports/*.md", { query: '?raw', import: 'default' }));
		this.importPersonas(import.meta.glob("@/assets/personas/*.md", { query: '?raw', import: 'default' }));
		this.importEvents(import.meta.glob("@/assets/events/*.md", { query: '?raw', import: 'default' }));
		this.importClocks(import.meta.glob("@/assets/clocks/*.json"));
		this.importReserves(import.meta.glob("@/assets/reserves/*.json"));
		this.importPilots(import.meta.glob("@/assets/pilots/*.json"));
	},
	mounted() {
		this.$router.push("/status");
		
		// Add global notification trigger
		window.showNotification = (title, message, type = 'info') => {
			this.notification.title = title;
			this.notification.message = message;
			this.notification.type = type;
			this.notification.isOpen = true;
		};
	},
	methods: {
		setTitleFavicon(title, favicon) {
			document.title = title;
			let headEl = document.querySelector('head');
			let faviconEl = document.createElement('link');
			faviconEl.setAttribute('rel', 'shortcut icon');
			faviconEl.setAttribute('href', favicon);
			headEl.appendChild(faviconEl);
		},

		async importMissions(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				let mission = {};
				let cleanContent = content.replace(/\r/g, "");
				mission["slug"] = cleanContent.split("\n")[0].trim();
				mission["name"] = cleanContent.split("\n")[1].trim();
				mission["status"] = cleanContent.split("\n")[2].trim();
				mission["content"] = cleanContent.split("\n").splice(3).join("\n");
				this.missions = [...this.missions, mission];
			});
			this.missions = this.missions.sort(function (a, b) {
				return b["slug"] - a["slug"];
			})
		},
		async importReports(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				let report = {};
				let cleanContent = content.replace(/\r/g, "");
				report["slug"] = cleanContent.split("\n")[0].trim();
				report["name"] = cleanContent.split("\n")[1].trim();
				report["status"] = cleanContent.split("\n")[2].trim();
				report["content"] = cleanContent.split("\n").splice(3).join("\n");
				this.reports = [...this.reports, report];
			});
			this.reports = this.reports.sort(function (a, b) {
				return b["slug"] - a["slug"];
			})
		},
		async importPersonas(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				let persona = {};
				let cleanContent = content.replace(/\r/g, "");
				persona["name"] = cleanContent.split("\n")[0].trim();
				persona["faction"] = cleanContent.split("\n")[1].trim();
				persona["status"] = cleanContent.split("\n")[2].trim();
				persona["image"] = cleanContent.split("\n")[3].trim();
				persona["content"] = cleanContent.split("\n").splice(4).join("\n");
				this.personas = [...this.personas, persona];
			});
		},
		async importEvents(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				let event = {};
				let cleanContent = content.replace(/\r/g, "");
				event["title"] = cleanContent.split("\n")[0].trim();
				event["location"] = cleanContent.split("\n")[1].trim();
				event["time"] = cleanContent.split("\n")[2].trim();
				event["thumbnail"] = cleanContent.split("\n")[3].trim();
				event["content"] = cleanContent.split("\n").splice(4).join("\n");
				this.events = [...this.events, event];
			});
			this.events = this.events.reverse();
		},
		async importClocks(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				this.clocks = JSON.parse(JSON.stringify(content)).default;
			});
		},
		async importReserves(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			fileContents.forEach(content => {
				this.reserves = JSON.parse(JSON.stringify(content)).default;
			});
		},
		async importPilots(files) {
			let filePromises = Object.keys(files).map(path => files[path]());
			let fileContents = await Promise.all(filePromises);
			
			// Load from JSON files
			fileContents.forEach(content => {
				let pilotFromJson = JSON.parse(JSON.stringify(content));
				pilotFromJson.name = pilotFromJson.name.replace("※", "");
				pilotFromJson.callsign = pilotFromJson.callsign.replace("※", "");
				let pilotFromVue = this.pilotSpecialInfo[pilotFromJson.callsign.toUpperCase()];
				let pilot = {
					...pilotFromJson,
					...pilotFromVue,
				};
				this.pilots = [...this.pilots, pilot];
				
				if (pilot.clocks) {
					pilot.clocks.forEach(content => {
						let clock = {};
						clock["type"] = `Pilot Project // ${pilot.callsign}`;
						clock["result"] = "";
						clock["name"] = content.title;
						clock["description"] = content.description;
						clock["value"] = content.progress;
						clock["max"] = content.segments;
						clock["color"] = "#3CB043";
						this.clocks = [...this.clocks, clock];
					});
				}

				if (pilot.reserves) {
					pilot.reserves.forEach(content => {
						let reserve = {};
						reserve["type"] = content.type;
						reserve["name"] = content.name;
						reserve["description"] = content.description;
						reserve["label"] = content.label;
						reserve["cost"] = content.cost;
						reserve["notes"] = content.notes;
						reserve["callsign"] = pilot.callsign.toUpperCase();
						this.reserves = [...this.reserves, reserve];
					});
				}
			});

			// Load from localStorage / API
			try {
				console.log("Iniciando sincronização de pilotos com o banco/local...");
				const saved = await pilotStore.getSavedPilots();
				console.log(`${saved.length} pilotos customizados encontrados.`);
				
				const customPilots = [];
				saved.forEach(pilot => {
					// Evitar duplicatas por callsign
					if (!this.pilots.find(p => p.callsign.toUpperCase() === pilot.callsign.toUpperCase())) {
						const pilotWithImage = { ...pilot, isCustom: true };
						
						// Vincular imagens locais otimizadas nos arquivos da página baseadas no callsign
						const callsign = pilot.callsign ? pilot.callsign.toUpperCase().trim() : "";
						
						const imageMap = {
							"ROSA NEGRA": "/images/pilots/rosa_negra.png",
							"NAS KANTA": "/images/pilots/Nas-kanta.png",
							"KANTA": "/images/pilots/Nas-kanta.png",
							"NAS-KANTA": "/images/pilots/Nas-kanta.png",
							"CARMESIN": "/images/pilots/carmesin.png",
							"DIA DO JULGAMENTO": "/images/pilots/dia_do_Julgamento.png",
							"OCELOT": "/images/pilots/ocelot.png",
							"SCOP-OLEAD": "/images/pilots/scop-olead.png",
							"SCOP OLEAD": "/images/pilots/scop-olead.png",
							"SULLA VIA DELLA GLORIA": "/images/pilots/sulla_via_della_gloria.webp",
							"THE NERGAL": "/images/pilots/the_nergal.png",
							"TRASH": "/images/pilots/trash.png",
							"WOLF": "/images/pilots/wolf.png"
						};
						
						if (imageMap[callsign]) {
							pilotWithImage.image = imageMap[callsign];
						} else if (callsign === "ROSA NEGRA") { // Fallback if the png is missing but jpg was there
							pilotWithImage.image = "/images/pilots/rosa_negra.jpg";
						} else if (callsign === "NAS KANTA" || callsign === "KANTA" || callsign === "NAS-KANTA") {
							pilotWithImage.image = "/images/pilots/nas_kanta.webp";
						}
						
						customPilots.push(pilotWithImage);
					}
				});
				
				this.pilots = [...this.pilots, ...customPilots];
				console.log("Lista de pilotos atualizada com sucesso.");
			} catch (e) {
				console.error("Erro ao carregar pilotos customizados:", e);
			}
		},
		showSampleNotification() {
			window.showNotification(
				"SISTEMA DE DIAGNÓSTICO",
				"Integridade do reator em 98.4%. Todos os sistemas de armas modulares carregados com sucesso. Protocolo de comunicação Alia ativo.",
				"info"
			);
		},
	},
};
</script>

<style>
#app {
	min-height: 100vh;
	overflow: hidden !important;
	/* border-right: 1px solid #ff0;
	border-bottom: 1px solid #ff0; */
}
</style>
