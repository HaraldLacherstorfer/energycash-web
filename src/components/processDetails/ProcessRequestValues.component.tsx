import React, {FC, forwardRef, useEffect, useState} from "react";
import {IonButton, IonContent, IonInput, IonItem} from "@ionic/react";
import InputForm from "../form/InputForm.component";
import SelectForm from "../form/SelectForm.component";
import DatePicker from "react-datepicker";
import {useForm} from "react-hook-form";
import {Metering} from "../../models/meteringpoint.model";
import {EdaProcess, Eeg} from "../../models/eeg.model";
import {EegParticipant} from "../../models/members.model";
import CorePageTemplate from "../core/CorePage.template";
import {eegService} from "../../service/eeg.service";
import {star} from "ionicons/icons";
import ProcessHeaderComponent from "./ProcessHeader.component";
import ProcessContentComponent from "./ProcessContent.component";

interface ProcessValues {
  communityId: string | undefined
  participantId: string | undefined
  meteringPoints: string[] | undefined
}
interface ProcessRequestValuesComponentProps {
  eeg: Eeg
  meters: Metering[]
  participants: EegParticipant[]
  edaProcess: EdaProcess
}

const ProcessRequestValuesComponent: FC<ProcessRequestValuesComponentProps> = ({eeg, meters, participants, edaProcess}) => {
  const processValues = {
    communityId: eeg.communityId,
    participantId: undefined,
    meteringPoints: undefined,
  }

  const {handleSubmit, reset,
    control, watch,
    setValue, formState} = useForm<ProcessValues>({defaultValues: processValues})
  const [useableMeters, setUsableMeters] = useState<Metering[]>([])
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [meteringPoints, participantId] = watch(['meteringPoints', 'participantId'])

  // useEffect(() => {
  //   if (!participantId) {
  //     if (meteringPoint) {
  //       const p = participants.find(p => p.meters.find(m => m.meteringPoint === meteringPoint))
  //       if (p) {
  //         setValue('participantId', p.id)
  //       }
  //     }
  //   }
  // }, [meteringPoints])

  useEffect(() => {
    if (participantId) {
      const p = participants.find(p=> p.id === participantId)
      if (p) {
        setUsableMeters(p.meters)
      }
    }
  }, [participantId])

  const onRequest = (data: ProcessValues) => {
    console.log("Mulitple Selection: ", data);
    if (data.participantId && data.meteringPoints && startDate && endDate) {

      const meter = meters.filter((m) => data.meteringPoints?.find((s:string) => s === m.meteringPoint))
      console.log("filtered Meters: ", meter);
      if (meter) {
        console.log("process Meters: ", meter);
          eegService.syncMeteringPoint(
            eeg.rcNumber.toUpperCase(), data.participantId,
            meter.map(m => {return {meter: m.meteringPoint, direction: m.direction}}),
            startDate.getTime(), endDate.getTime())
            .finally(() => {
              reset()
              setDateRange([null, null])
            })
      }
    }
  }

  const Component = forwardRef<HTMLIonInputElement, {}>(function CustomInput(p, ref) {
    return (
      <IonInput
        {...p}
        label={"Zeitraum"}
        placeholder="Enter text"
        fill="outline"
        labelPlacement={"floating"}
        ref={ref}
      >
      </IonInput>
    );
  });

  return (
    <>
      <ProcessHeaderComponent name={edaProcess.name} />
      <ProcessContentComponent>
        <CorePageTemplate>
          <>
            <InputForm name="communityId" label="Gemeinschafts-Id" control={control} readonly={true}/>
            <SelectForm control={control} name={"participantId"} options={participants.map((p) => {
              return {key: p.id, value: p.firstname + " " + p.lastname}
            })} label={"Mitglied"} selectInterface={"popover"} rules={{required: true}}/>
            <SelectForm control={control} name={"meteringPoints"} options={useableMeters.map((p) => {
              return {key: p.meteringPoint, value: p.meteringPoint + " (" + p.equipmentName + ")"}
            })} label={"Zählpunkt"} selectInterface={"popover"} multiple={true} rules={{required: true}}/>
            <div className="form-element">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update);
                }}
                customInput={<Component/>}
              />
            </div>
            <IonItem lines="none" style={{zIndex: "0"}}>
              <IonButton slot="end" onClick={handleSubmit(onRequest)} disabled={(!formState.isValid || !startDate || !endDate)}>
                Anfordern
              </IonButton>
            </IonItem>
          </>
      </CorePageTemplate>
      </ProcessContentComponent>
    </>
  )
}

export default ProcessRequestValuesComponent