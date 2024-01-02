import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

interface Items {
  id: number;
  name: string;
  price: number;
}
type ReceiptProps = {
  id: number;
  onChange: (id: number, items: Items[]) => void;
  onDelete: (id: number) => void;
};

const Receipt = ({ id, onChange, onDelete }: ReceiptProps) => {
  const [items, setItems] = useState([{ id: 1, name: "", price: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [serviceChargeBoolean, setServiceChargeBoolean] = useState(true);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [gstBoolean, setGSTBoolean] = useState(true);
  const [gst, setGST] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

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
      newGST = Math.round(newSubtotal * 0.09);
    }
    const newGrandTotal = newSubtotal + newServiceCharge + newGST;

    setSubtotal(newSubtotal / 100);
    setServiceCharge(newServiceCharge / 100);
    setGST(newGST / 100);
    setGrandTotal(newGrandTotal / 100);
  }, [items, serviceChargeBoolean, gstBoolean]);

  const handleDeleteReceipt = () => {
    onDelete(id);
  };
  const handleChangeReceipt = (items: Items[]) => {
    onChange(id, items);
  };
  const handleAddItem = () => {
    const newItem = { id: Date.now(), name: "", price: 0 };
    setItems((currentItems) => [...currentItems, newItem]);
  };
  const handleChangeItemName = (id: number, newItemName: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, name: newItemName } : item
    );
    setItems(newItems);
    handleChangeReceipt(newItems);
  };
  const handleChangeItemPrice = (id: number, newItemPrice: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, price: parseFloat(newItemPrice) } : item
    );
    setItems(newItems);
    handleChangeReceipt(newItems);
  };
  const handleDeleteItem = (id: number, e: React.MouseEvent) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    console.log("delete item");
  };
  const test = () => {
    console.log(items);
  };
  return (
    <>
      <div className="flex justify-end py-6">
        <Button variant="outline-danger w-full" onClick={handleDeleteReceipt}>
          Delete receipt
        </Button>
      </div>
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
      <div className="flex justify-end">
        <Button onClick={handleAddItem}>Add item</Button>
        <Button onClick={test}>test</Button>
      </div>
      {/* SECTION - Subtotal, Service Charge, GST, Grand Total */}
      <div className="py-4">
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
                  onChange={(e) =>
                    setServiceChargeBoolean(!serviceChargeBoolean)
                  }
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
                  onChange={(e) => setGSTBoolean(!gstBoolean)}
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
    </>
  );
};
export default Receipt;
