import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

type PersonProps = {
  id: number;
  name: string;
  onChange: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
};

const Person = ({ id, name, onChange, onDelete }: PersonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    onChange(id, newName);
  };
  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control placeholder="Name" value={name} onChange={handleChange} />
        <Button variant="outline-danger" onClick={handleDelete}>
          –
        </Button>
      </InputGroup>
    </>
  );
};
export default Person;
