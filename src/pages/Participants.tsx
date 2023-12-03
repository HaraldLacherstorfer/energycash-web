import React, {FC, Suspense, useContext} from "react";
import {IonContent, IonPage, SelectCustomEvent} from "@ionic/react";
import ParticipantPaneComponent from "../components/participantPane/ParticipantPane.component";

import "./Participants.css"
import {useAppSelector} from "../store";
import {
  selectedParticipantSelector
} from "../store/participant";
import {ParticipantContext} from "../store/hook/ParticipantProvider";
import {MemberViewContext} from "../store/hook/MemberViewProvider";

const Participants: FC = () => {
  // const periods = useAppSelector(periodsSelector);
  // const activePeriod = useAppSelector(selectedPeriodSelector);
  // const participants = useAppSelector(activeParticipantsSelector1);

  const selectedParticipant = useAppSelector(selectedParticipantSelector);

  // console.log("PARTICIPANTS:", participants, activePeriod)

  const {
    billingEnabled,
    showAddMeterPane,
  } = useContext(ParticipantContext);

  const {
    showAmount
  } = useContext(MemberViewContext)

  function showParticipantDetails() {
    if (selectedParticipant) {
      if (showAmount) {
        const ParticipantInvoiceDetailsComponent =
          React.lazy(() => import("../components/participantPane/ParticipantInvoiceDetails.component"))
        return (
          <Suspense fallback = { <div> Invoicing loading ... </div> }>
            <ParticipantInvoiceDetailsComponent />
          </Suspense>
        )
      } else if (showAddMeterPane) {
        const AddMeterPaneComponent =
          React.lazy(() => import("../components/participantPane/AddMeterPane.component"))
        return (
          <Suspense fallback = { <div></div> }>
            <AddMeterPaneComponent />
          </Suspense>
        )
      } else {
        const ParticipantDetailsPaneComponent =
          React.lazy(() => import("../components/participantPane/ParticipantDetailsPane.component"))
        return (
          <Suspense fallback = { <div></div> }>
            <ParticipantDetailsPaneComponent/>
          </Suspense>
        )
      }
    } else {
      return (
        <></>
      )
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen color="eeg">
        <div style={{display:"flex", flexDirection:"row"}}>
          <div style={{height: "100%", overflow: "hidden"}}>
            <ParticipantPaneComponent
              // participants={participants}
              // activePeriod={activePeriod}
              // onUpdatePeriod={(e: SelectCustomEvent<number>) => console.log("Update Period", e)}
              // periods={periods}
            />
          </div>
          <div style={{flexGrow:"1", background: "#EAE7D9", height: "100vh", overflow: "hidden"}}>
            {showParticipantDetails()}
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default Participants;