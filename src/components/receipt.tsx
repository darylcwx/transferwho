import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

type ReceiptProps = {
  id: number;
  onDelete: (id: number) => void;
};

const Receipt = ({ id, onDelete }: ReceiptProps) => {
  const [amount, setAmount] = useState(0);
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState([{ name: "", price: 0 }]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newItemName = e.target.value;
    setItemName(newItemName);
    //onChange(id, newName);
  };
  const handleDeleteReceipt = () => {
    onDelete(id);
  };

  const handleAddItem = () => {
    console.log("add item");
  };
  const handleDeleteItem = () => {
    console.log("delete item");
  };
  useEffect(() => {
    console.log(items);
  }, []);
  return (
    <>
      <div>
        <>
          <div className="flex justify-end py-6">
            <Button
              variant="outline-danger w-full"
              onClick={handleDeleteReceipt}>
              Delete receipt
            </Button>
          </div>
          {items.map((item) => (
            <>
              <div className="">
                <Row>
                  <Col xs="6" sm="7" md="8" lg="9">
                    <InputGroup className="mb-3">
                      <Form.Control
                        placeholder="Item name"
                        value={item.name}
                        onChange={handleNameChange}
                      />
                    </InputGroup>
                  </Col>
                  <Col>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        placeholder="0.00"
                        value={item.name}
                        onChange={handleNameChange}
                      />
                      <Button
                        variant="outline-danger"
                        onClick={handleDeleteItem}>
                        –
                      </Button>
                    </InputGroup>
                  </Col>
                </Row>
              </div>
            </>
          ))}
          <div className="flex justify-end">
            <Button onClick={handleAddItem}>Add item</Button>
          </div>
        </>
      </div>
    </>
  );
};
export default Receipt;
