import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";
import {EnergyMeta, EnergyReport, ParticipantReport, SelectedPeriod} from "../../../models/energy.model";

export const featureKey = 'energy';

export interface EnergyEntitieState {
  meta: EntityState<EnergyMeta, string>
  participantReports: EntityState<ParticipantReport, string>
  intermediateReportResults:EntityState<EnergyReport, string>
  report: EnergyReport | undefined
  selectedPeriod: SelectedPeriod | undefined
  totalProduction: number
  totalConsumption: number
}

export interface EnergyMetaState extends EntityState<EnergyMeta, string> {
  isFetching: boolean;
}
export const metaAdapter = createEntityAdapter<EnergyMeta, string>({
  selectId: (meta) => meta.name
});

export const reportAdapter = createEntityAdapter<EnergyReport, string>({
  selectId: (report:EnergyReport) => report.id
})

export const participantReportAdapter = createEntityAdapter<ParticipantReport, string>({
  selectId: (report) => report.participantId
})

export const initialState: EnergyEntitieState = {
  meta: metaAdapter.getInitialState({isFetching: false}),
  intermediateReportResults: reportAdapter.getInitialState(),
  participantReports: participantReportAdapter.getInitialState(),
  report : undefined,
  selectedPeriod: undefined,
  totalConsumption: 0,
  totalProduction: 0,
};
