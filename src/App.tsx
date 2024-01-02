import { useEffect, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Accordion from "react-bootstrap/Accordion";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import Person from "./components/person";
import Receipt from "./components/receipt";

export default function App() {
  const copyToClipboard = () => {
    const site = "https://transferwho.vercel.app/";
    navigator.clipboard.writeText(site);
    alert("Copied!");
  };
  const [key, setKey] = useState("1");

  //SECTION - People
  const [people, setPeople] = useState([
    { id: 1, name: "" },
    { id: 2, name: "" },
  ]);
  const addPerson = () => {
    const newPerson = { id: Date.now(), name: "" };
    setPeople((currentPeople) => [...currentPeople, newPerson]);
  };
  const changePerson = (id: number, newName: string) => {
    setPeople((currentPeople) =>
      currentPeople.map((person) =>
        person.id === id ? { ...person, name: newName } : person
      )
    );
  };
  const deletePerson = (id: number) => {
    setPeople((currentPeople) =>
      currentPeople.filter((person) => person.id !== id)
    );
  };

  //SECTION - Receipt
  const [receipts, setReceipts] = useState([
    { id: 1, items: [] as Array<object> },
  ]);
  const addReceipt = () => {
    const lastReceipt = receipts[receipts.length - 1];
    const newReceipt = { id: lastReceipt.id + 1, items: [] };
    setReceipts((currentReceipts) => [...currentReceipts, newReceipt]);
    setKey((receipts.length - 1).toString());
  };
  const changeReceipt = (id: number, items: Array<object>) => {
    console.log("id: " + id, "items: " + items);
    const newReceipts = receipts.map((receipt) =>
      receipt.id === id ? { ...receipt, items: items } : receipt
    );
    setReceipts(newReceipts);
  };
  const deleteReceipt = (id: number) => {
    setReceipts((currentReceipts) =>
      currentReceipts.filter((receipt) => receipt.id !== id)
    );
  };

  //SECTION - Receipt
  const [results, setResults] = useState([
    { name: "Jason", share: 15.4, transfer: "15.40 to Dar" },
    { name: "Jada", share: 10.4, transfer: "10.40 to Dar" },
    { name: "Daryl", share: 60.4, transfer: "" },
  ]);

  const test = () => {
    console.log(receipts);
  };
  return (
    <>
      <div className="bg-gray-800 min-h-screen">
        <div className="container text-white">
          <div className="py-2">
            <h1 className="">Hello, world!</h1>
            <div className="mb-3">
              Are you the person always paying the bill first? Or do your
              friends pay different bills and y'all need to see who owes who how
              much? Looks no further!
            </div>
            <div className="mb-3">
              Works best if one person paid for everything first. Or just settle
              your own receipt and send your friends{" "}
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                  <Tooltip id="site">
                    <span>Copy link to clipboard</span>
                  </Tooltip>
                }>
                <a
                  href=""
                  onClick={copyToClipboard}
                  className="text-blue-300 hover:underline no-underline">
                  this site
                </a>
              </OverlayTrigger>
              . 👀
            </div>
            <div className="mb-3">
              <div>
                <i className="bi bi-1-circle-fill" />
                <span> Fill in all names of people</span>
              </div>
              <div>
                <i className="bi bi-2-circle-fill" />
                <span>
                  {" "}
                  Fill in your receipt items, who paid first, GST/SVC
                </span>
              </div>
              <div>
                <i className="bi bi-3-circle-fill" />
                <span> See results and profit!!</span>
              </div>
            </div>
            <div className="mb-3">
              Optical Character Recognition (OCR) has been implemented. However,
              I haven't tested with enough receipts. Feel free to send me
              feedback via Telegram{" "}
              <a
                href="https://t.me/damnsope"
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-300 hover:underline no-underline">
                @damnsope
              </a>
              .
            </div>
          </div>
          <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className="pr-1">People</span>
                <i className="bi bi-people-fill"></i>
              </Accordion.Header>
              <Accordion.Body>
                <p>Please enter the names of all involved.</p>
                {people.map((person) => (
                  <Person
                    key={person.id}
                    id={person.id}
                    onChange={changePerson}
                    onDelete={deletePerson}
                  />
                ))}
                <div className="flex justify-end">
                  <Button variant="primary" onClick={addPerson}>
                    Add person
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      console.log(people);
                    }}>
                    test
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Receipts</Accordion.Header>
              <Accordion.Body>
                <p>
                  Please enter all items and their prices before service charge
                  and GST, <span className="font-medium">for each receipt</span>
                  .
                </p>
                <Tabs
                  className=""
                  activeKey={key}
                  onSelect={(k) => setKey(k || "")}>
                  {receipts.map((receipt, index) => (
                    <Tab eventKey={index} title={receipt.id} key={index}>
                      <Receipt
                        key={receipt.id}
                        id={receipt.id}
                        onChange={changeReceipt}
                        onDelete={deleteReceipt}
                      />
                    </Tab>
                  ))}
                  <Tab
                    eventKey="new"
                    style={{ padding: "0" }}
                    title={
                      <i className="bi bi-plus-lg" onClick={addReceipt} />
                    }></Tab>
                </Tabs>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Results</Accordion.Header>
              <Accordion.Body>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Share</th>
                      <th>Transfer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results &&
                      results.map((result, index) => (
                        <tr key={index}>
                          <td>{result.name}</td>
                          <td>{result.share}</td>
                          <td>{result.transfer}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                <div className="flex justify-end">
                  <Button onClick={test}>test</Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}
