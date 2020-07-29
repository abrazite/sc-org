export interface RSICitizenSchema {
  citizenRecord?: number;
  citizenName?: string;
  handleName?: string;
  enlistedRank?: string;
  enlisted?: Date;
  location?: string;
  fluency?: string;

  mainOrganization: {
    name?: string;
    spectrumIdentification?: string;
    rank?: string;
  };

  bio?: string;
}