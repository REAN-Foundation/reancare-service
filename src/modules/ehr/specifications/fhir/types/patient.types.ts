export const EncounterTypes = [
    {
        text   : 'ambulatory',
        code   : 'AMB',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'emergency',
        code   : 'EMER',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'field',
        code   : 'FLD',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'home health',
        code   : 'HH',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'inpatient encounter',
        code   : 'IMP',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'inpatient acute',
        code   : 'ACUTE',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'inpatient non-acute',
        code   : 'NONAC',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'observation encounter',
        code   : 'OBSENC',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'pre-admission',
        code   : 'PRENC',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'short stay',
        code   : 'SS',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
    {
        text   : 'virtual',
        code   : 'VR',
        system : 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
    },
];

export const EncounterStatusTypes = [
    'planned',
    'arrived',
    'triaged',
    'in-progress',
    'onleave',
    'finished',
    'cancelled',
];
