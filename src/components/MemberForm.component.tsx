import React, {FC, useEffect, useState, ClipboardEvent} from "react";
import {IonCol, IonGrid, IonList, IonListHeader, IonRow} from "@ionic/react";
import {people} from "ionicons/icons";
import InputForm from "./form/InputForm.component";
import {useForm} from "react-hook-form";
import {EegParticipant} from "../models/members.model";
import {eegBusiness} from "../eegIcons";
import ToggleButtonComponent from "./ToggleButton.component";

interface MemberFormComponentProps {
  participant: EegParticipant
  formId: string
  onSubmit: (data: EegParticipant) => void
}

const MemberFormComponent: FC<MemberFormComponentProps> = ({participant, formId, onSubmit}) => {

  const [selectedBusinessType, setSelectedBusinessType] = useState(0)

  const { handleSubmit, setValue, control,clearErrors,  reset, formState: {errors} } = useForm({
    defaultValues: participant, mode: "all"});

  const onChangeBusinessType = (s: number) => {
    setSelectedBusinessType(s)
    setValue("businessRole", s === 0 ? "EEG_PRIVATE" : "EEG_BUSINESS")
  }

  useEffect(() => {
    if (participant) {
      participant.businessRole === 'EEG_PRIVATE' ? setSelectedBusinessType(0) : setSelectedBusinessType(1)
      reset(participant)
    }
  }, [participant])

  const handlePhonePaste = (e: ClipboardEvent<HTMLIonInputElement>) => {
    e.persist()
    e.clipboardData.items[0].getAsString(text=>{
      setValue("contact.phone", text.replace(/\+/gi, "00").replace(/\s/gi,""))
    })
    e.stopPropagation()
  }

  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="auto">
            <ToggleButtonComponent
              buttons={[{label: 'Privat', icon: people}, {label: 'Firma', icon: eegBusiness}]}
              onChange={onChangeBusinessType}
              value={selectedBusinessType}
              changeable={true}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      <form onBlur={handleSubmit(onSubmit)}>
        <IonList>
          <IonListHeader>Kontakt</IonListHeader>
          <InputForm name={"participantNumber"} label="Mitglieds-Nr" control={control} type="text"/>
          {selectedBusinessType === 0 ? (
              <>
                <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
                  <InputForm name={"titleBefore"} label="Titel (Vor)" control={control} type="text"/>
                  <InputForm name={"titleAfter"} label="Titel (Nach)" control={control} type="text"/>
                </div>
                <InputForm name={"firstname"} label="Vorname" control={control}
                           rules={{required: "Vorname fehlt"}} type="text" error={errors.firstname}/>
                <InputForm name={"lastname"} label="Nachname" control={control} rules={{required: "Vorname fehlt"}}
                           type="text" error={errors.lastname}/>
              </>
            ) :
            (
              <InputForm name={"firstname"} label="Firmenname" control={control}
                         rules={{required: "Firmenname fehlt"}} type="text" error={errors.firstname}/>
            )
          }
          <InputForm name={"residentAddress.street"} label="Straße" control={control} rules={{required: "Straße fehlt"}} type="text" error={errors.residentAddress?.street} clear={clearErrors}/>
          <InputForm name={"residentAddress.streetNumber"} label="Hausnummer" control={control} type="text"/>
          <InputForm name={"residentAddress.zip"} label="Postleitzahl" control={control} type="text"/>
          <InputForm name={"residentAddress.city"} label="Ort" control={control} type="text"/>
          <InputForm name={"contact.phone"} label="Telefon" control={control} onPaste={handlePhonePaste} type="text"/>
          <InputForm name={"contact.email"} label="E-Mail" control={control} rules={{required: "Email Adresse fehlt"}} type="text" error={errors.contact?.email} clear={clearErrors}/>
        </IonList>
        <IonList>
          <IonListHeader>Bankdaten</IonListHeader>
          <InputForm name={"accountInfo.iban"} label="IBAN" control={control} type="text"/>
          <InputForm name={"accountInfo.owner"} label="Kontoinhaber" control={control} type="text"/>
        </IonList>
      </form>
    </>
  )
}

export default MemberFormComponent;