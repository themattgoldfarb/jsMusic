import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { useRef } from 'react';
import Sound, { NoteValue, PlayingState, WaveType, WaveTypes } from './sound';

function waveTypeById (id: number): WaveType {
  return Object.values(WaveTypes).find(waveType => waveType.id === id) as WaveType;
}

interface OvertoneRowValue {
  id: number;
  waveType: WaveType;
  gainLevel: number;
  overtoneRatio: number;
};

function OvertoneRow(
  {overtoneRow, deleteRowHandler, editOvertoneRowHandler} 
  : {overtoneRow: OvertoneRowValue,
     deleteRowHandler: (id: number) => void,
     editOvertoneRowHandler: (row: OvertoneRowValue) => void}) {

  function editWaveTypeHandler(
      event: React.ChangeEvent<HTMLSelectElement>) {
    overtoneRow.waveType = waveTypeById(parseInt(event.target.value));
    editOvertoneRowHandler(overtoneRow);
  }

  function editGainLevelHandler(
      event: React.ChangeEvent<HTMLInputElement>) {
    overtoneRow.gainLevel = parseFloat(event.target.value);
    editOvertoneRowHandler(overtoneRow);
  }

  function editOvertoneRatioHandler(
      event: React.ChangeEvent<HTMLInputElement>) {
    overtoneRow.overtoneRatio = parseFloat(event.target.value);
    editOvertoneRowHandler(overtoneRow);
  }

  return (
    <>
      <Row>
        <Col>
          <WaveTypeSelector 
              waveType={overtoneRow.waveType}
              editWaveTypeHandler={editWaveTypeHandler}/>
        </Col>
        <Col>
          <GainLevelSelector 
              gainLevel={overtoneRow.gainLevel}
              editGainLevelHandler={editGainLevelHandler} />
        </Col>
        <Col>
          <OvertoneRatioSelector 
              overtoneRatio={overtoneRow.overtoneRatio}
              editOvertoneRatioHandler={editOvertoneRatioHandler}
          />
        </Col>
        <Col>
          <DeleteRowButton id={overtoneRow.id}
              deleteRowHandler={deleteRowHandler}/>
        </Col>
      </Row>
    </>
  );
}

function OvertoneRatioSelector({overtoneRatio, editOvertoneRatioHandler}
  : {overtoneRatio: number,
      editOvertoneRatioHandler: (event: React.ChangeEvent<HTMLInputElement>) => void}

) {
  return (
    <Form.Control
      type="number"
      placeholder="2"
      value={overtoneRatio}
      onChange={editOvertoneRatioHandler}
    />
  );
}

function WaveTypeSelector({waveType, editWaveTypeHandler}
  : {waveType: WaveType,
     editWaveTypeHandler: 
      (event: React.ChangeEvent<HTMLSelectElement>) => void}) {
  return (
    <Form.Select 
        aria-label="Default select example"
        onChange={editWaveTypeHandler}>

      {Object.values(WaveTypes).map((wt) => {
        if (wt.id === waveType.id) {
          return <option selected value={wt.id}>{wt.label}</option>
        }
        return <option value={wt.id}>{wt.label}</option>
      })}

    </Form.Select>
  );
}

function GainLevelSelector({gainLevel, editGainLevelHandler}
  : {gainLevel: number,
     editGainLevelHandler: (event: React.ChangeEvent<HTMLInputElement>) => void}) {
  return (
    <>
      <Form.Range onChange={editGainLevelHandler} min="0.00001" max="1" step="0.00001" value={gainLevel}/>

    </>
  );
}

function DeleteRowButton({id, deleteRowHandler} 
  : {id: number,
     deleteRowHandler: (id: number) => void}) {
  return (
    <Button variant="primary"
      onClick={() => deleteRowHandler(id)}
    >
      Delete Row {id}
    </Button>
  );
}

function AddRowButton({clickHandler}
  : {clickHandler: () => void}) {
  return (
    <Button variant="primary"
      onClick={clickHandler}
     >
      Add Row
    </Button>
  );
}

function Generator() {
  const [overtoneRows, setOvertoneRows] = React.useState<OvertoneRowValue[]>([]);
  let nextId = useRef(0);

  function getNotes() : NoteValue[] {
    return overtoneRows.map((overtoneRow) => {
      return {
        name: "Overtone-"+overtoneRow.overtoneRatio,
        frequency: 220 * overtoneRow.overtoneRatio,
        gainLevel: overtoneRow.gainLevel,
        waveType: overtoneRow.waveType,
      };
    });
  }

  function addRowHandler() {
    let newRow : OvertoneRowValue = {
      id: nextId.current++,
      waveType: WaveTypes.SINE,
      gainLevel: 1,
      overtoneRatio: 1,
    }
    if (overtoneRows.length > 0) {
      newRow.overtoneRatio = overtoneRows[overtoneRows.length - 1].overtoneRatio + 1;
      newRow.gainLevel = overtoneRows[0].gainLevel / (overtoneRows.length+1);
      newRow.waveType = overtoneRows[0].waveType;
    }
    setOvertoneRows([...overtoneRows, newRow]);
  }

  function editOvertoneRowHandler(
      row: OvertoneRowValue) {
    setOvertoneRows(
      overtoneRows.map((overtoneRow) => {
        if (overtoneRow.id === row.id) {
          overtoneRow.waveType = row.waveType;
          overtoneRow.gainLevel = row.gainLevel;
          overtoneRow.overtoneRatio = row.overtoneRatio;
        }
        return overtoneRow;
      }));
  }

  function deleteRowHandler(id: number) {
    
    let newRows = [];
    for (const overtoneRow of overtoneRows) {
      if (overtoneRow.id !== id) {
        newRows.push(overtoneRow);
      }
    }
    console.log(id);
    console.log(overtoneRows);
    console.log(newRows);
    setOvertoneRows(newRows);
  }

  return (
    <div className="Generator">
      {overtoneRows.map((overtoneRow, index) => (
        <OvertoneRow 
            overtoneRow={overtoneRow}
            deleteRowHandler={deleteRowHandler}
            editOvertoneRowHandler={editOvertoneRowHandler}
            />
      ))}
      <AddRowButton clickHandler={addRowHandler}/>

      <Sound playingState={PlayingState.Generating}
          notes={getNotes()} />
    </div>
  );
}

export default Generator;
