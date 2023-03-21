import { EventStatus, EventType, Option, TerraUser } from './webhook.event';
import { Meal } from './webhook.event';

export interface NutritionDomainModel {
  Status : EventStatus;
  Type   : EventType;
  User   : TerraUser;
  MetaData : NutritionMetaData;
  Summary : NutritionSummary;
  Meals : Meal[];
}

export interface NutritionMetaData {
 
    EndTime: string;
    StartTime: string;
}

export interface NutritionSummary {
    Macros: {
      FatG: Option<number>;
      TransFatG?: Option<number>;
      FiberG: Option<number>;
      CarbohydratesG: Option<number>;
      ProteinG: Option<number>;
      CholesterolMg: Option<number>;
      SodiumMg?: Option<number>;
      Calories: number;
      SugarG?: Option<number>;
      AlcoholG?: Option<number>;
    };
    Micros?: {
      SeleniumMg: Option<number>;
      NiacinMg: Option<number>;
      MagnesiumMg: Option<number>;
      CopperMg: Option<number>;
      VitaminB12Mg: Option<number>;
      VitaminB6Mg: Option<number>;
      VitaminCMg: Option<number>;
      ZincMg: Option<number>;
      VitaminEMg: Option<number>;
      ManganeseMg: Option<number>;
      VitaminDMg: Option<number>;
      IodineMg: Option<number>;
      ChlorideMg: Option<number>;
      Folate_mg: Option<number>;
      CalciumMg: Option<number>;
      MolybdenumMg: Option<number>;
      VitaminAMg: Option<number>;
      RiboflavinMg: Option<number>;
      FolicAcidMg: Option<number>;
      IronMg: Option<number>;
      ThiaminMg: Option<number>;
      PantothenicAcidMg: Option<number>;
      CaffeineMg: Option<number>;
      VitaminKMg: Option<number>;
      ChromiumMg: Option<number>;
      PotassiumMg: Option<number>;
      BiotinMg: Option<number>;
      PhosphorusMg: Option<number>;
    };
    WaterMl: Option<number>;
}
