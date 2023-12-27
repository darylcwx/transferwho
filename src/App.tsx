import { useEffect, useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Accordion from "react-bootstrap/Accordion";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";

import Person from "./components/person";
import Receipt from "./components/receipt";

export default function App() {
  const [people, setPeople] = useState([
    { id: 1, name: "" },
    { id: 2, name: "" },
  ]);
  const [key, setKey] = useState("Receipt 1");
  const [receipts, setReceipts] = useState([
    { id: 1, title: "Receipt 1", content: "Content for 1" },
    { id: 2, title: "Receipt 2", content: "Content for 2" },
  ]);

  const copyToClipboard = () => {
    const site = "https://transferwho.vercel.app/";
    navigator.clipboard.writeText(site);
    alert("Copied!");
  };

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

  // const addReceipt = () => {
  //   const newReceipt = { id: Date.now() };
  //   setReceipts((currentReceipts) => [...currentReceipts, newReceipt]);
  // };

  const deleteReceipt = (id: number) => {
    setReceipts((currentReceipts) =>
      currentReceipts.filter((receipt) => receipt.id !== id)
    );
  };

  useEffect(() => {
    console.log(receipts);
  }, []);
  return (
    <>
      <div className="bg-gray-800 min-h-screen">
        <div className="container text-white">
          <div className="py-2">
            <h1 className="">Hello, world!</h1>
            <p className="">
              Are you the person always paying the bill first? Or do your
              friends pay different bills and y'all need to see who owes who how
              much? Looks no further!
            </p>
            <p className="">
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
            </p>
            <p className="">
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
            </p>
            <p>
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
            </p>
          </div>
          <Accordion defaultActiveKey="0">
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
                <Tabs
                  defaultActiveKey="Receipt 1"
                  className=""
                  activeKey={key}
                  onSelect={(k) => setKey(k || "")}>
                  {receipts.map((receipt) => (
                    <Receipt
                      key={receipt.id}
                      id={receipt.id}
                      title={receipt.title}
                      content={receipt.content}
                      //onDelete={deleteReceipt}
                    />
                  ))}
                  <Tab eventKey="new" title="+"></Tab>
                </Tabs>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Results</Accordion.Header>
              <Accordion.Body>results go here</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}
