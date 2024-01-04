import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

interface Items {
  id: number;
  name: string;
  price: number;
}
interface Participation {
  [key: string]: Array<string>;
}
interface Person {
  id: number;
  name: string;
}
type ReceiptProps = {
  id: number;
  people: Person[];
  onChange: (
    id: number,
    items: Items[],
    personPaidFirst: Person,
    participation: Participation,
    serviceCharge: boolean,
    gst: boolean,
    subtotal: number,
    grandTotal: number
  ) => void;
  onDelete: (id: number) => void;
};

const Receipt = ({ id, people, onChange, onDelete }: ReceiptProps) => {
  const [items, setItems] = useState([
    { id: 1, name: "hahn 1", price: 33.36 },
    { id: 2, name: "gf ao", price: 10.8 },
  ]);
  const [subtotal, setSubtotal] = useState(0);
  const [serviceChargeBoolean, setServiceChargeBoolean] =
    useState<boolean>(true);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [gstBoolean, setGSTBoolean] = useState<boolean>(true);
  const [gst, setGST] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [personPaidFirst, setPersonPaidFirst] = useState<Person>();
  const [participation, setParticipation] = useState({});
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const newSubtotal = parseFloat(
      items.reduce((sum, item) => sum + item.price * 100, 0).toFixed(2)
    );

    let newServiceCharge = 0;
    if (serviceChargeBoolean) {
      newServiceCharge = Math.round(newSubtotal * 0.1);
    }

    let newGST = 0;
    if (gstBoolean) {
      newGST = Math.round((newSubtotal + newServiceCharge) * 0.09);
    }
    const newGrandTotal = newSubtotal + newServiceCharge + newGST;
    setSubtotal(newSubtotal / 100);
    setServiceCharge(newServiceCharge / 100);
    setGST(newGST / 100);
    setGrandTotal(newGrandTotal / 100);
    handleChangeReceipt(
      items,
      personPaidFirst as Person,
      participation,
      serviceChargeBoolean,
      gstBoolean,
      newSubtotal / 100,
      newGrandTotal / 100
    );
  }, [items, serviceChargeBoolean, gstBoolean]);

  //SECTION - Receipt
  const handleDeleteReceiptModal = () => {
    setShowModal(!showModal);
  };
  const handleDeleteReceipt = () => {
    onDelete(id);
  };

  const handleChangeReceipt = (
    items: Items[],
    personPaidFirst: Person,
    participation: Participation,
    serviceCharge: boolean,
    gst: boolean,
    subtotal: number,
    grandTotal: number
  ) => {
    onChange(
      id,
      items,
      personPaidFirst,
      participation,
      serviceCharge,
      gst,
      subtotal,
      grandTotal
    );
  };

  //SECTION - Items
  const handleAddItem = () => {
    const newItem = { id: Date.now(), name: "", price: 0 };
    setItems((currentItems) => [...currentItems, newItem]);
  };
  const handleChangeItemName = (id: number, newItemName: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, name: newItemName } : item
    );
    setItems(newItems);
  };
  const handleChangeItemPrice = (id: number, newItemPrice: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, price: parseFloat(newItemPrice) } : item
    );
    setItems(newItems);
  };
  const handleDeleteItem = (id: number, e: React.MouseEvent) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  //SECTION - Person Paid First
  const handleChangePersonPaidFirst = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const personPaidFirstId = parseInt(e.target.value);
    let personPaidFirstObject = people.find(
      (person) => person.id === personPaidFirstId
    );
    if (!personPaidFirstObject) {
      personPaidFirstObject = { id: 1, name: "not found" };
    }
    setPersonPaidFirst(personPaidFirstObject);
    handleChangeReceipt(
      items,
      personPaidFirstObject,
      participation,
      serviceChargeBoolean,
      gstBoolean,
      subtotal,
      grandTotal
    );
  };

  //SECTION - Participation
  useEffect(() => {
    const currentParticipation = { ...participation } as {
      [key: string]: Array<string>;
    };
    for (let i = 0; i < people.length; i++) {
      const person = people[i].name;
      const personItems = [];
      for (let j = 0; j < items.length; j++) {
        personItems.push(items[j].name);
      }
      currentParticipation[person] = personItems;
    }
    setParticipation(currentParticipation);
  }, [people, items]);

  const handleCheck = (personName: string, itemName: string) => {
    const currentParticipation = { ...participation } as {
      [key: string]: Array<string>;
    };
    const index = currentParticipation[personName].indexOf(itemName);
    if (index !== -1) {
      currentParticipation[personName].splice(index, 1);
    } else {
      currentParticipation[personName].push(itemName);
    }
    setParticipation(currentParticipation);
    handleChangeReceipt(
      items,
      personPaidFirst as Person,
      currentParticipation,
      serviceChargeBoolean,
      gstBoolean,
      subtotal,
      grandTotal
    );
  };

  return (
    <>
      <div className="flex justify-end py-4">
        <Button
          variant="outline-danger w-full"
          onClick={handleDeleteReceiptModal}>
          Delete receipt
        </Button>
      </div>
      <div className="">
        <Modal
          className=""
          dialogClassName="modal-50w"
          show={showModal}
          onHide={handleDeleteReceiptModal}
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Data entered will not be saved.</p>
            <div className="flex justify-end">
              <Button onClick={handleDeleteReceipt}>Confirm</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      {/* SECTION - Items */}
      <h3 className="">Items</h3>
      <div className="">
        {items.map((item, index) => (
          <div key={index}>
            <div className="">
              <Row>
                <Col xs="6" sm="7" md="8" lg="9">
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) =>
                        handleChangeItemName(item.id, e.target.value)
                      }
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={item.price || ""}
                      onChange={(e) =>
                        handleChangeItemPrice(item.id, e.target.value)
                      }
                      disabled={!item.name ? true : false}
                    />
                    <Button
                      variant="outline-danger"
                      onClick={(e) => handleDeleteItem(item.id, e)}>
                      –
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pb-4">
        <Button onClick={handleAddItem}>Add item</Button>
      </div>
      <div className="">
        <div>
          <Row className="">
            <Col
              xs="6"
              sm="7"
              md="8"
              lg="9"
              className="h-10 flex items-center justify-end">
              Subtotal
            </Col>
            <Col className="h-10">
              <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={subtotal.toString()}
                  disabled
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="">
            <Col xs="6" sm="7" md="8" lg="9" className="h-10">
              <InputGroup className="flex justify-end">
                <InputGroup.Text>10% SVC</InputGroup.Text>
                <InputGroup.Checkbox
                  checked={serviceChargeBoolean}
                  onChange={(e) => setServiceChargeBoolean(e.target.checked)}
                />
              </InputGroup>
            </Col>
            <Col className="h-10">
              <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={serviceCharge}
                  disabled
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="">
            <Col xs="6" sm="7" md="8" lg="9" className="h-10">
              <InputGroup className="flex justify-end">
                <InputGroup.Text>9% GST</InputGroup.Text>
                <InputGroup.Checkbox
                  checked={gstBoolean}
                  onChange={(e) => setGSTBoolean(e.target.checked)}
                />
              </InputGroup>
            </Col>
            <Col className="h-10">
              <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={gst}
                  disabled
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="">
            <Col
              xs="6"
              sm="7"
              md="8"
              lg="9"
              className="h-10 flex items-center justify-end">
              <div className="">Grand Total</div>
            </Col>
            <Col className="h-10">
              <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={grandTotal}
                  disabled
                />
              </InputGroup>
            </Col>
          </Row>
        </div>
      </div>
      <hr className="border-2" />
      {/* SECTION - Paid first */}
      <div className="">
        <h3 className="">Who paid first?</h3>
        <p className="">
          Select the <span className="line-through">sugar daddy</span> person
          who paid first.
        </p>
        <Form.Select
          className=""
          onChange={(e) => handleChangePersonPaidFirst(e)}>
          Select one
          <option>Select a person</option>
          {people.map((person, index) => (
            <option key={index} value={person.id}>
              {person.name}
            </option>
          ))}
        </Form.Select>
      </div>
      <hr className="border-2" />
      {/* SECTION - Participation */}
      <div className="">
        <h3 className="">Participation</h3>
        <Table>
          <thead>
            <tr>
              <th className="font-semibold pt-0">Name</th>
              {items.map((item, index) => (
                <th key={index} className="font-semibold pt-0">
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((person, index) => (
              <tr key={index}>
                <td>{person.name}</td>
                {items.map(
                  (item, index) =>
                    item.name && (
                      <td key={index}>
                        <Form.Check
                          type="checkbox"
                          id={person.id.toString() + item.id.toString()}
                          defaultChecked
                          onChange={(e) => handleCheck(person.name, item.name)}
                        />
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
export default Receipt;
