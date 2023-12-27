import { useState } from "react";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";

type ReceiptProps = {
  id: number;
  title: string;
  content: string;
  //onDelete: (id: number) => void;
};

const Receipt = ({ id, title, content }: ReceiptProps) => {
  const [amount, setAmount] = useState(0);

  const handleDelete = () => {
    //onDelete(id);
  };
  return (
    <>
      <Tab eventKey={id} title={title}>
        {content}
        <Button variant="outline-danger" onClick={handleDelete}>
          delete
        </Button>
      </Tab>
    </>
  );
};
export default Receipt;
