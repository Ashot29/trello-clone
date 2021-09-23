import React from "react";
import BasicTable from "./basic-table";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "@material-ui/core";
import UserModal from "./userModal";
import { openUserModal } from "../../stateManagement/actions/userModalActionCreator";
import { useDispatch } from "react-redux";
import DeleteDialog from "./alert-dialog";
import "./index.css";

const Users = () => {
  const dispatch = useDispatch();
  const data = {
    userModalIsOpen: true,
    country: "",
    firstName: "",
    lastName: "",
    age: "",
    email: "",
  };
  const handleOpen = () => dispatch(openUserModal(data));

  return (
    <div className="users-section">
      <BasicTable />
      <div className="user-add-button">
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          style={{ marginTop: "10px" }}
          onClick={handleOpen}
        >
          Add new users
        </Button>
      </div>
      <UserModal />
      <DeleteDialog />
    </div>
  );
};

export default Users;
