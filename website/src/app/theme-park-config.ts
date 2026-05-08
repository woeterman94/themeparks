export interface ThemeParkApiFieldMap {
  id: string;
  name: string;
  waitTime: string;
  status: string;
  lastUpdated: string;
}

export interface ThemeParkApiConfig {
  type: string;
  endpoint: string;
  responsePath?: string;
  fields: ThemeParkApiFieldMap;
  statusMap: Record<string, string>;
}

export interface ThemeParkConfig {
  parkApiId: string;
  slug: string;
  name: string;
  api: ThemeParkApiConfig;
}

const toSlug = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const defaultApiConfig = (parkApiId: string): ThemeParkApiConfig => ({
  type: 'themeparks-wiki-preview',
  endpoint: `https://api.themeparks.wiki/preview/parks/${parkApiId}/waittime`,
  fields: {
    id: 'id',
    name: 'name',
    waitTime: 'waitTime',
    status: 'status',
    lastUpdated: 'lastUpdate'
  },
  statusMap: {
    Operating: 'Operating',
    Closed: 'Closed',
    Refurbishment: 'Refurbishment',
    Down: 'Down',
    OPEN: 'Operating',
    CLOSED: 'Closed',
    REFURB: 'Refurbishment',
    DOWN: 'Down'
  }
});

const parks = [
  { parkApiId: 'WaltDisneyWorldMagicKingdom', name: 'Magic Kingdom - Walt Disney World Florida' },
  { parkApiId: 'WaltDisneyWorldEpcot', name: 'Epcot - Walt Disney World Florida' },
  { parkApiId: 'WaltDisneyWorldHollywoodStudios', name: 'Hollywood Studios - Walt Disney World Florida' },
  { parkApiId: 'WaltDisneyWorldAnimalKingdom', name: 'Animal Kingdom - Walt Disney World Florida' },
  { parkApiId: 'DisneylandResortMagicKingdom', name: 'Magic Kingdom - Disneyland Resort' },
  { parkApiId: 'DisneylandResortCaliforniaAdventure', name: 'California Adventure - Disneyland Resort' },
  { parkApiId: 'DisneylandParisMagicKingdom', name: 'Magic Kingdom - Disneyland Paris' },
  { parkApiId: 'DisneylandParisWaltDisneyStudios', name: 'Walt Disney Studios - Disneyland Paris' },
  { parkApiId: 'HongKongDisneyland', name: 'Hong Kong Disneyland' },
  { parkApiId: 'ShanghaiDisneyResortMagicKingdom', name: 'Magic Kingdom - Shanghai Disney Resort' },
  { parkApiId: 'TokyoDisneyResortMagicKingdom', name: 'Magic Kingdom - Tokyo Disney Resort' },
  { parkApiId: 'TokyoDisneyResortDisneySea', name: 'Disney Sea - Tokyo Disney Resort' },
  { parkApiId: 'EuropaPark', name: 'Europa Park' },
  { parkApiId: 'AsterixPark', name: 'Parc-Asterix' },
  { parkApiId: 'CaliforniasGreatAmerica', name: "California's Great America" },
  { parkApiId: 'CanadasWonderland', name: "Canada's Wonderland" },
  { parkApiId: 'Carowinds', name: 'Carowinds' },
  { parkApiId: 'CedarPoint', name: 'Cedar Point' },
  { parkApiId: 'KingsIsland', name: 'Kings Island' },
  { parkApiId: 'KnottsBerryFarm', name: "Knott's Berry Farm" },
  { parkApiId: 'Dollywood', name: 'Dollywood' },
  { parkApiId: 'SilverDollarCity', name: 'Silver Dollar City' },
  { parkApiId: 'SeaworldOrlando', name: 'Seaworld Orlando' },
  { parkApiId: 'Efteling', name: 'Efteling' },
  { parkApiId: 'HersheyPark', name: 'Hershey Park' },
  { parkApiId: 'UniversalStudiosFlorida', name: 'Universal Studios Florida' },
  { parkApiId: 'UniversalIslandsOfAdventure', name: "Universal's Islands Of Adventure" },
  { parkApiId: 'UniversalVolcanoBay', name: 'Universal Volcano Bay' },
  { parkApiId: 'UniversalStudiosHollywood', name: 'Universal Studios Hollywood' },
  { parkApiId: 'UniversalStudiosSingapore', name: 'Universal Studios Singapore' },
  { parkApiId: 'UniversalStudiosJapan', name: 'Universal Studios Japan' },
  { parkApiId: 'SixFlagsOverTexas', name: 'Six Flags Over Texas' },
  { parkApiId: 'SixFlagsOverGeorgia', name: 'Six Flags Over Georgia' },
  { parkApiId: 'SixFlagsStLouis', name: 'Six Flags St. Louis' },
  { parkApiId: 'SixFlagsGreatAdventure', name: 'Six Flags Great Adventure' },
  { parkApiId: 'SixFlagsMagicMountain', name: 'Six Flags Magic Mountain' },
  { parkApiId: 'SixFlagsGreatAmerica', name: 'Six Flags Great America' },
  { parkApiId: 'SixFlagsFiestaTexas', name: 'Six Flags Fiesta Texas' },
  { parkApiId: 'SixFlagsHurricaneHarborArlington', name: 'Six Flags Hurricane Harbor, Arlington' },
  { parkApiId: 'SixFlagsHurricaneHarborLosAngeles', name: 'Six Flags Hurricane Harbor, Los Angeles' },
  { parkApiId: 'SixFlagsAmerica', name: 'Six Flags America' },
  { parkApiId: 'SixFlagsDiscoveryKingdom', name: 'Six Flags Discovery Kingdom' },
  { parkApiId: 'SixFlagsNewEngland', name: 'Six Flags New England' },
  { parkApiId: 'SixFlagsHurricaneHarborJackson', name: 'Six Flags Hurricane Harbor, Jackson' },
  { parkApiId: 'TheGreatEscape', name: 'The Great Escape' },
  { parkApiId: 'SixFlagsWhiteWaterAtlanta', name: 'Six Flags White Water, Atlanta' },
  { parkApiId: 'SixFlagsMexico', name: 'Six Flags México' },
  { parkApiId: 'LaRondeMontreal', name: 'La Ronde, Montreal' },
  { parkApiId: 'SixFlagsHurricaneHarborOaxtepec', name: 'Six Flags Hurricane Harbor, Oaxtepec' },
  { parkApiId: 'SixFlagsHurricaneHarborConcord', name: 'Six Flags Hurricane Harbor, Concord' },
  { parkApiId: 'PortAventura', name: 'PortAventura' },
  { parkApiId: 'FerrariLand', name: 'Ferrari Land' },
  { parkApiId: 'AltonTowers', name: 'Alton Towers' },
  { parkApiId: 'ThorpePark', name: 'Thorpe Park' },
  { parkApiId: 'ChessingtonWorldOfAdventures', name: 'Chessington World Of Adventures' },
  { parkApiId: 'Bellewaerde', name: 'Bellewaerde' },
  { parkApiId: 'Phantasialand', name: 'Phantasialand' },
  { parkApiId: 'HeidePark', name: 'Heide Park' },
  { parkApiId: 'BuschGardensTampa', name: 'Busch Gardens Tampa' },
  { parkApiId: 'BuschGardensWilliamsburg', name: 'Busch Gardens Williamsburg' },
  { parkApiId: 'Liseberg', name: 'Liseberg' },
  { parkApiId: 'Toverland', name: 'Toverland' }
];

export const THEME_PARKS: ThemeParkConfig[] = parks.map((park) => ({
  ...park,
  slug: toSlug(park.parkApiId),
  api: defaultApiConfig(park.parkApiId)
}));
