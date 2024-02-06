module.exports = function autoSetLoot(m) {
	let lootSetTime = null;
	m.command.add("setloot", {
		$default() {
			setLoot();
		},
		toggle() {
			m.settings.enabled = !m.settings.enabled;
            m.command.message(`Auto Set Loot ${m.settings.enabled?'en':'dis'}abled.`);
		},
		auto() { //This isn't implemented yet.
			m.settings.auto = !m.settings.auto;
            m.command.message(`Automatic Mode: ${m.settings.auto?'en':'dis'}abled.`);
		},
		party() { //This isn't implemented yet.
			m.settings.party = !m.settings.party;
            m.command.message(`Notify Party: ${m.settings.party?'en':'dis'}abled.`);
		}
	});
	function setLoot(){
		if(!m.settings.enabled) return m.command.message('Auto Set Loot is not enabled. To enable it, please use command: setloot toggle');
		lootSetTime = Date.now();
		m.send("C_PARTY_LOOTING_METHOD",1,{
				methodLoot:1,
				rareGrade:0,
				methodRare:1,
				rareEquipment:false,
				rareClass:true,
				methodBound:0,
				noCombat:false
			});
	};
	m.hook("C_PARTY_LOOTING_METHOD", 'raw', event => {
		lootSetTime = Date.now();
	});
    m.hook("S_PARTY_LOOTING_METHOD_VOTE", 1, event => {
		//Need to prompt us if we're leader and a party member set loot via this mod.
		if (lootSetTime && (Date.now() - lootSetTime) < 250) return;
        event.isLeader = false;
    });
};