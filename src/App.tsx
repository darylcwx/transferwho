import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";

import Person from "./components/person";
import Receipt from "./components/receipt";

interface Person {
  id: number;
  name: string;
}
interface Items {
  id: number;
  name: string;
  price: number;
}
interface Participation {
  [key: string]: Array<string>;
}
interface Receipt {
  id: number;
  items: Items[];
  personPaidFirst?: Person;
  participation?: Participation;
  serviceCharge?: boolean;
  gst?: boolean;
  subtotal?: number;
  grandTotal?: number;
}

export default function App() {
  const copyToClipboard = () => {
    const site = "https://transferwho.vercel.app/";
    navigator.clipboard.writeText(site).then(() => {
      alert("Copied!");
    });
  };
  const [key, setKey] = useState(1);

  //SECTION - People
  const [people, setPeople] = useState<Person[]>([
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
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: 1, items: [], serviceCharge: true, gst: true },
  ]);
  const [overallTotal, setOverallTotal] = useState("");
  const addReceipt = () => {
    const newReceiptID =
      receipts.length === 0 ? 1 : receipts[receipts.length - 1].id + 1;
    const newReceipt: Receipt = {
      id: newReceiptID,
      items: [],
      personPaidFirst: undefined,
      participation: undefined,
      serviceCharge: true,
      gst: true,
      subtotal: 0,
      grandTotal: 0,
    };
    setReceipts((currentReceipts) => [...currentReceipts, newReceipt]);
    setKey(newReceiptID);
  };
  const changeReceipt = (
    id: number,
    items: Items[],
    personPaidFirst: Person,
    participation: Participation,
    serviceCharge: boolean,
    gst: boolean,
    subtotal: number,
    grandTotal: number
  ) => {
    const newReceipts = receipts.map((receipt) =>
      receipt.id === id
        ? {
            ...receipt,
            items: items,
            personPaidFirst: personPaidFirst,
            participation: participation,
            serviceCharge: serviceCharge,
            gst: gst,
            subtotal: subtotal,
            grandTotal: grandTotal,
          }
        : receipt
    );
    setReceipts(newReceipts);
  };
  const deleteReceipt = (id: number) => {
    setReceipts((currentReceipts) =>
      currentReceipts.filter((receipt) => receipt.id !== id)
    );
    setKey(id - 1);
  };

  useEffect(() => {
    let total = 0;
    let peoplePaidFirst: { [key: string]: number } = {};
    for (const receipt of receipts) {
      if (receipt.grandTotal !== undefined) {
        total += receipt.grandTotal;
      }
      if (receipt.personPaidFirst !== undefined) {
        const name = receipt.personPaidFirst.name;
        if (name in peoplePaidFirst) {
          peoplePaidFirst[name] += receipt.grandTotal ?? 0;
        } else {
          peoplePaidFirst[name] = receipt.grandTotal ?? 0;
        }
      }
    }
    setOverallTotal(total.toFixed(2));

    const personsPerItem: { [key: string]: number } = {};
    const itemPricePerPerson: { [key: string]: number } = {};
    for (const receipt of receipts) {
      for (const item of receipt.items) {
        let count = 0;
        for (const participant in receipt.participation) {
          if (receipt.participation[participant].includes(item.name)) {
            count++;
          }
        }
        personsPerItem[item.name] = count;
        let itemPrice = item.price * 100;
        if (receipt.serviceCharge) itemPrice = Math.round(itemPrice * 1.1);
        if (receipt.gst) itemPrice = Math.round(itemPrice * 1.09);
        itemPricePerPerson[item.name] =
          Math.round(itemPrice / personsPerItem[item.name]) / 100;
      }
    }

    const overallParticipation: { [key: string]: string[] } = {};
    for (const receipt of receipts) {
      for (const participant in receipt.participation) {
        const items = receipt.participation[participant];
        if (overallParticipation[participant]) {
          overallParticipation[participant] =
            overallParticipation[participant].concat(items);
        } else {
          overallParticipation[participant] = items;
        }
      }
    }
    const temp = [];
    for (const participant in overallParticipation) {
      let amount = 0;
      const participantItems = overallParticipation[participant];
      for (const item of participantItems) {
        amount += itemPricePerPerson[item];
      }
      const personObject = {
        name: participant,
        share: Math.round(amount * 100) / 100,
        transfer: undefined as number | undefined,
      };
      temp.push(personObject);
    }
    const netTransfers: { [key: string]: number } = {};
    for (const person in peoplePaidFirst) {
      netTransfers[person] = -peoplePaidFirst[person];
    }
    for (const person of temp) {
      if (person.name in netTransfers) {
        person.transfer =
          Math.round((person.share + netTransfers[person.name]) * 100) / 100;
      } else {
        person.transfer = person.share;
      }
    }
    setResults(temp);
  }, [receipts]);

  //SECTION - Results
  const [results, setResults] = useState<Array<any>>([]);
  // const test = () => {
  //   console.log(results);
  // };
  //SECTION - Like
  const [message, setMessage] = useState("");
  const [likeSuccess, setLikeSuccess] = useState(false);
  const [likeError, setLikeError] = useState(false);
  const handleLike = async () => {
    try {
      const token = import.meta.env.VITE_TOKEN;
      const chatID = import.meta.env.VITE_CHAT_ID;
      const text = encodeURIComponent(
        `Someone liked your NEW transferwho app!!\nMessage: ${message}`
      );
      const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${text}`;
      fetch(url).then((response) => {
        if (response.ok) {
          setLikeSuccess(true);
        } else {
          setLikeError(true);
        }
      });
    } catch (error) {
      setLikeError(true);
      console.error(error);
    }
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
            <Button className="mb-3" onClick={copyToClipboard}>
              Copy website link <i className="pl-1 bi bi-copy"></i>
            </Button>
            <div className="mb-3">
              Feel free to send me feedback via Telegram{" "}
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
          <Accordion defaultActiveKey="0" alwaysOpen className="pb-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span className="pr-1">People</span>
                <i className="bi bi-people-fill"></i>
              </Accordion.Header>
              <Accordion.Body>
                <p>Please enter the names of all persons involved.</p>
                {people.map((person, index) => (
                  <Person
                    key={index}
                    id={person.id}
                    name={person.name}
                    onChange={changePerson}
                    onDelete={deletePerson}
                  />
                ))}
                <div className="flex justify-end">
                  <Button variant="primary" onClick={addPerson}>
                    Add person
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Receipts</Accordion.Header>
              <Accordion.Body>
                <div className="pb-3">
                  <div>
                    Please
                    <ol className="list-disc mb-2">
                      <li className="">Add new receipts if required</li>
                      <li className="">
                        Enter all item names and their prices
                      </li>
                      <li className="">Check/uncheck service charge and GST</li>
                    </ol>
                    <small className="opacity-75">
                      Do note that 9% GST is taxable on both subtotal and
                      service charge.
                    </small>
                  </div>
                </div>
                <div className="pb-3">
                  <Button className="w-full" onClick={addReceipt}>
                    New receipt
                  </Button>
                </div>
                <Tabs
                  className=""
                  activeKey={key}
                  defaultActiveKey={1}
                  onSelect={(k) => setKey(k ? parseInt(k) : 0)}>
                  {receipts.map((receipt, index) => (
                    <Tab eventKey={receipt.id} title={receipt.id} key={index}>
                      <Receipt
                        key={receipt.id}
                        id={receipt.id}
                        onChange={changeReceipt}
                        onDelete={deleteReceipt}
                        people={people}
                      />
                    </Tab>
                  ))}
                </Tabs>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Results</Accordion.Header>
              <Accordion.Body>
                {/* <Button onClick={test}>test</Button> */}
                <div className="opacity-75 pb-3">
                  If the 'transfer' section is not working, try:
                  <ol className="list-disc mb-2">
                    <li className="">Select the person who paid first</li>
                    <li className="">Don't reuse the same names</li>
                  </ol>
                  If that doesn't work, please leave a message below 🥺
                </div>
                <h5 className="">Overall grand total: ${overallTotal}</h5>
                <Table className="pb-5">
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
                <Form.Group className="pt-1 pb-1">
                  <Form.Label htmlFor="message">
                    If this helped you, please do drop a like!
                  </Form.Label>
                  <InputGroup>
                    {!likeSuccess && !likeError && (
                      <>
                        <Form.Control
                          id="message"
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Optional message or feedback"
                        />

                        <Button variant="danger" onClick={handleLike}>
                          <i className="bi bi-heart-fill"></i>
                        </Button>
                      </>
                    )}
                  </InputGroup>
                </Form.Group>
                {likeSuccess && (
                  <Alert variant="success">
                    <Alert.Heading>Success!</Alert.Heading>
                    Message received with thanks!🤩
                  </Alert>
                )}
                {likeError && (
                  <Alert variant="danger">
                    <Alert.Heading>Oh no!</Alert.Heading>
                    Something went wrong, please try again later!
                  </Alert>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}
