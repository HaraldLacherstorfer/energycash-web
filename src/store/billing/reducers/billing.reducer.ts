import {createReducer} from "@reduxjs/toolkit";
import {adapter, initialState} from "../states";
import {fetchEnergyBills, fetchParticipantAmounts, resetParticipantAmounts} from "../actions";

export const reducer = createReducer(initialState, builder =>
  builder
      .addCase(fetchEnergyBills.pending, state => {
          return { ...state, isFetching: true };
      })
    .addCase(fetchEnergyBills.fulfilled, (state, action) => {
//      console.log("Reducer Billing. Payload: ", action.payload)
      const {billing} = action.payload
      return adapter.setAll({... state, isFetching: false }, billing.participantAmounts)
    })
      .addCase(fetchEnergyBills.rejected, state => {
          return { ...state, isFetching: false };
      })
      .addCase(fetchParticipantAmounts.pending, state => {
          return { ...state, isFetching: true };
      })
      .addCase(fetchParticipantAmounts.fulfilled, (state, action) => {
//      console.log("Reducer Billing. Payload: ", action.payload)
          const {participantAmounts} = action.payload
          return adapter.setAll({... state, isFetching: false }, participantAmounts)
      })
      .addCase(fetchParticipantAmounts.rejected, state => {
          return { ...state, isFetching: false };
      })
      .addCase(resetParticipantAmounts, () => {
          return initialState;
      })

);
