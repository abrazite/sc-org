const users = require('./users-002.json');
const v4 = require('uuid');
const fetch = require('node-fetch');

const API_SERVER = 'http://localhost:8081/api/1.0.0';

function createTheIMC() {
  const orgInfo = {
    id: '4b40e446-5ceb-4543-a6d8-fa4e28a00406',       // v4();
    adminId: '74844e1c-94f8-423c-a2cb-680fd3631e98',  // v4();
    additionDate: new Date(Date.parse('2020-08-07T19:59:40.000Z')), // date to use when missing and don't want to use now
  };

  return createOrg({
    date: orgInfo.additionDate,
    organizationId: orgInfo.id,
    name: 'Interstellar Management Corps',
    sid: 'THEIMC',
    memberCount: 292,
    archetype: 'Organization',
    primaryActivity: 'Freelancing',
    secondaryActivity: 'Security',
    commitment: 'Regular',
    primaryLanguage: 'English',
    recruiting: true,
    rolePlay: true,
    exclusive: true
  })
    .then(() => {
      orgInfo.branches = [
        { organizationId: orgInfo.id, abbreviation: 'BOD', branch: 'Board of Directors' },
        { organizationId: orgInfo.id, abbreviation: 'HJ', branch: 'Helljumpers' },
        { organizationId: orgInfo.id, abbreviation: 'J', branch: 'Jaegers' },
        { organizationId: orgInfo.id, abbreviation: 'VA', branch: 'Void Angels' },
        { organizationId: orgInfo.id, abbreviation: 'SD', branch: 'Stanton Dynamics' },
      ];
      return Promise.all(orgInfo.branches.map(e => createBranch(e)))
        .then(ids => ids.forEach((id, i) => { orgInfo.branches[i].id = id; }));
    })
    .then(() => {
      orgInfo.grades = [
        { organizationId: orgInfo.id, abbreviation: 'O6' },
        { organizationId: orgInfo.id, abbreviation: 'O2' },
        { organizationId: orgInfo.id, abbreviation: 'O1' },
        { organizationId: orgInfo.id, abbreviation: 'E6' },
        { organizationId: orgInfo.id, abbreviation: 'E5' },
        { organizationId: orgInfo.id, abbreviation: 'E4' },
        { organizationId: orgInfo.id, abbreviation: 'E3' },
        { organizationId: orgInfo.id, abbreviation: 'E2' },
        { organizationId: orgInfo.id, abbreviation: 'E1' },
      ];
      return Promise.all(orgInfo.grades.map(e => createGrade(e)))
        .then(ids => ids.forEach((id, i) => { orgInfo.grades[i].id = id; }));
    })
    .then(() => {
      orgInfo.ranks = [
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'O6'), abbreviation: 'DIR', rank: 'Director'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'O2'), abbreviation: 'CDR', rank: 'Commander'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'O1'), abbreviation: 'LTCDR', rank: 'Lt. Commander'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E6'), abbreviation: 'MCSO', rank: 'Master Chief Space Warfare Operator'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E5'), abbreviation: 'SSPC-Z', rank: 'Senior Combat Specalist - Zulu'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E4'), abbreviation: 'SPC', rank: 'Combat Specialist'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E5'), abbreviation: 'CSO', rank: 'Chief Space Warfare Operator'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E4'), abbreviation: 'SO', rank: 'Space Warfare Operator'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E3'), abbreviation: 'SN', rank: 'Starman'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E2'), abbreviation: 'SA', rank: 'Starman Apprentice'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), gradeId: getId(orgInfo.grades, 'E1'), abbreviation: 'SR', rank: 'Starman Recruit'},
      ];
      return Promise.all(orgInfo.ranks.map(e => createRank(e)))
        .then(ids => ids.forEach((id, i) => { orgInfo.ranks[i].id = id; }));
    })
    .then(() => {
      orgInfo.certifications = [
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'BG', rank: 'Basic Ground'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'CQB', rank: 'Close-Quarters Battle'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'HJ', rank: 'Helljumper Qualification'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'AG', rank: 'Advanced Ground Tactics'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'L', rank: 'Leadership'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'J'), abbreviation: 'F', rank: 'Fighter'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'VA'), abbreviation: 'TP', rank: 'Transport'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'SD'), abbreviation: 'TD', rank: 'Trade'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'I-BG', rank: 'Instructor - Basic Ground'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'I-CQB', rank: 'Instructor - Close-Quarters Battle'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'I-HJ', rank: 'Instructor - Helljumper Qualification'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'HJ'), abbreviation: 'I-AG', rank: 'Instructor - Advanced Ground Tactics'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'J'), abbreviation: 'I-F', rank: 'Instructor - Fighter'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'VA'), abbreviation: 'I-TP', rank: 'Instructor - Transport'},
        { organizationId: orgInfo.id, branchId: getId(orgInfo.branches, 'SD'), abbreviation: 'I-TD', rank: 'Instructor - Trade'},
      ];
      return Promise.all(orgInfo.certifications.map(e => createCertification(e)))
        .then(ids => ids.forEach((id, i) => { orgInfo.certifications[i].id = id; }));
    })
    .then(() => {
      orgInfo.personnel = users;
      return Promise.all(orgInfo.personnel.map((e, i) => createPersonnel(orgInfo, e, i)));
    });
}

/** helper function to get an id for the first match in an array */
function getId(array, abbreviation) {
  const e = array.find(a => a.abbreviation === abbreviation);
  if (!e) {
    throw new Error(`could not find ${abbreviation} in ${array.map(e => e.abbreviation)}`);
  }
  return e.id;
} 

function createOrg(json) {
  json.date.setUTCMilliseconds(0);
  return fetch(`${API_SERVER}/rsi-organization?organizationId=${json.organizationId}&date=${json.date.toISOString()}`)
    .then(res => res.ok ? res.json() : [{ status: 'error' }])
    .then(res => Array.isArray(res) && res.length === 1)
    .then(orgExists => {
      if (!orgExists) {
        return fetch(`${API_SERVER}/rsi-organization`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json),
        })
          .then(res => res.ok ? res.json() : { status: 'error' });
      }
    });
}

function createBranch(json) {
  return createRecord(
    `${API_SERVER}/branches?organizationId=${json.organizationId}&abbreviation=${json.abbreviation}`,
    `${API_SERVER}/branches`,
    json
  );
}

function createGrade(json) {
  return createRecord(
    `${API_SERVER}/grades?organizationId=${json.organizationId}&abbreviation=${json.abbreviation}`,
    `${API_SERVER}/grades`,
    json
  );
}

function createRank(json) {
  return createRecord(
    `${API_SERVER}/ranks?organizationId=${json.organizationId}&abbreviation=${json.abbreviation}`,
    `${API_SERVER}/ranks`,
    json
  );
}

function createCertification(json) {
  return createRecord(
    `${API_SERVER}/certifications?organizationId=${json.organizationId}&abbreviation=${json.abbreviation}`,
    `${API_SERVER}/certifications`,
    json
  );
}

function createPersonnel(orgInfo, personnelJson, defaultDiscriminator) {
  return createDiscordFromPersonnel(orgInfo, personnelJson, defaultDiscriminator)
    .then(id => {
      personnelJson.id = id;
    })
    .then(() => createRsiCitizenRecordsFromPersonnel(personnelJson))
    .then(() => createRankChangeRecordsFromPersonnel(orgInfo, personnelJson))
    .then(() => createJoinedOrgRecordsFromPersonnel(orgInfo, personnelJson))
    .then(() => createCertificationRecordsFromPersonnel(orgInfo, personnelJson));
}

function createDiscordFromPersonnel(orgInfo, personnel, defaultDiscriminator) {
  const discordSplit = personnel.discord.split('#');
  const json = {
    date: orgInfo.additionDate,
    organizationId: orgInfo.id,
    personnelId: personnel.id ? personnel.id : v4(),
    issuerPersonnelId: orgInfo.adminId,
    username: discordSplit[0],
    discriminator: discordSplit[1] ? discordSplit[1] : defaultDiscriminator
  }
  json.date.setUTCMilliseconds(0);
  return createDiscord(json)
    .then(() => fetch(`${API_SERVER}/discord?organizationId=${json.organizationId}&date=${json.date.toISOString()}&username=${json.username}&discriminator=${json.discriminator}`)
    .then(res => res.ok ? res.json() : { status: 'error' })
    .then(res => Array.isArray(res) && res.length > 0 ? res[0] : null))
    .then(record => {
      if (record && record.personnelId) {
        return record.personnelId;
      } else {
        throw new Error(`could not create discord: ${json.username}`);
      }
    });
}

function createDiscord(json) {
  json.date.setUTCMilliseconds(0);
  return createRecord(
    `${API_SERVER}/discord?organizationId=${json.organizationId}&date=${json.date.toISOString()}&username=${json.username}&discriminator=${json.discriminator}`,
    `${API_SERVER}/discord`,
    json
  );
}

function createRsiCitizenRecordsFromPersonnel(personnel) {
  return Promise.all(personnel.serviceRecords.filter(r => r.kind === 'RsiCitizenRecord').map(r => {
    const fluency  = r.rsiCitizen.fluency ? r.rsiCitizen.fluency.split(',').map(s => s.trim()).join(', ') : null;
    const json = {
      date: r.date ? new Date(Date.parse(r.date)) : orgInfo.additionDate,
      personnelId: personnel.id,
      citizenRecord: r.rsiCitizen.citizenRecord,
      citizenName: r.rsiCitizen.citizenName,
      handleName: r.rsiCitizen.handleName,
      enlistedRank: r.rsiCitizen.enlistedRank,
      enlistedDate: r.rsiCitizen.enlisted,
      location: r.rsiCitizen.location,
      fluency: fluency,
      website: r.rsiCitizen.website,
      biography: r.rsiCitizen.bio
    };

    return createRsiCitizenRecord(json);
  }));
}

function createRsiCitizenRecord(json) {
  json.date.setUTCMilliseconds(0);
  return createRecord(
    `${API_SERVER}/rsi-citizen?personnelId=${json.personnelId}&date=${json.date.toISOString()}`,
    `${API_SERVER}/rsi-citizen`,
    json
  );
}

function createRankChangeRecordsFromPersonnel(orgInfo, personnel) {
  return Promise.all(personnel.serviceRecords.filter(r => r.kind === 'RankChangeRecord').map(r => {
    const rankAbbreviation = r.rank.split('-').splice(2, 10).join('-');
    const rankId = getId(orgInfo.ranks, rankAbbreviation);
    if (!rankId) {
      throw new Error(`could not find rank: ${rankAbbreviation} in ${orgInfo.ranks.map(r => r.abbreviation)}`);
    }

    const json = {
      date: r.date ? new Date(Date.parse(r.date)) : orgInfo.additionDate,
      organizationId: orgInfo.id,
      personnelId: personnel.id,
      issuerPersonnelId: orgInfo.adminId,
      rankId: rankId
    }

    return createRankChangeRecord(json);
  }));
}

function createRankChangeRecord(json) {
  json.date.setUTCMilliseconds(0);
  return createRecord(
    `${API_SERVER}/rank-change?organizationId=${json.organizationId}&date=${json.date.toISOString()}&personnelId=${json.personnelId}&rankId=${json.rankId}`,
    `${API_SERVER}/rank-change`,
    json
  );
}

function createJoinedOrgRecordsFromPersonnel(orgInfo, personnel) {
  return Promise.all(personnel.serviceRecords.filter(r => r.kind === 'RankChangeRecord').map(r => {
    const json = {
      date: r.date ? new Date(Date.parse(r.date)) : orgInfo.additionDate,
      organizationId: orgInfo.id,
      personnelId: personnel.id,
      issuerPersonnelId: orgInfo.adminId,
      joinedOrganizationId: personnel.joinedOrganizationId ? personnel.joinedOrganizationId : orgInfo.id,
      recruitedByPersonnelId: personnel.recruitedByPersonnelId,
    }

    return createJoinedOrgRecord(json);
  }));
}

function createJoinedOrgRecord(json) {
  json.date.setUTCMilliseconds(0);
  return createRecord(
    `${API_SERVER}/joined-organization?organizationId=${json.organizationId}&date=${json.date.toISOString()}&personnelId=${json.personnelId}&joinedOrganizationId=${json.joinedOrganizationId}`,
    `${API_SERVER}/joined-organization`,
    json
  );
}

function createCertificationRecordsFromPersonnel(orgInfo, personnel) {
  return Promise.all(personnel.serviceRecords.filter(r => r.kind === 'CertificationRecord').map(r => {
    const certificationAbbr = r.certification.split('-').splice(1, 10).join('-');
    const certificationId = getId(orgInfo.certifications, certificationAbbr);
    if (!certificationId) {
      throw new Error(`could not find certification: ${certificationAbbr} in ${orgInfo.certifications.map(r => r.abbreviation)}`);
    }

    const json = {
      date: r.date ? new Date(Date.parse(r.date)) : orgInfo.additionDate,
      organizationId: orgInfo.id,
      personnelId: personnel.id,
      issuerPersonnelId: orgInfo.adminId,
      certificationId: certificationId
    }

    return createCertificationRecord(json);
  }));
}

function createCertificationRecord(json) {
  json.date.setUTCMilliseconds(0);
  return createRecord(
    `${API_SERVER}/certification?organizationId=${json.organizationId}&date=${json.date.toISOString()}&personnelId=${json.personnelId}&certificationId=${json.certificationId}`,
    `${API_SERVER}/certification`,
    json
  );
}

function createRecord(getRoute, postRoute, json) {
  return fetch(getRoute)
    .then(res => res.ok ? res.json() : { status: 'error' })
    .then(res => Array.isArray(res) && res.length > 0 ? res[0] : null)
    .then(record => {
      if (record === null) {
        return fetch(postRoute, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json),
        })
          .then(res => res.ok ? 
            res.json() : 
            res.json().then(e => { 
              throw new Error(JSON.stringify(e) + ': ' + JSON.stringify(json));
            }));
      }
      return record;
    })
    .then(record => record.id);
}

function importUsers() {
  const allRanks = {};
  users.forEach(user => {
    user.serviceRecords.filter(t => t.kind === 'RankChangeRecord').forEach(t => {
      allRanks[t.rank] = v4();
    });
  });

  console.log(allRanks);
}

createTheIMC();
