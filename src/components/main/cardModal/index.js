import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Button } from "@material-ui/core";
import { closeModal } from "../../../stateManagement/actions/modalActionCreator";
import { DEFAULT_URL } from "../../../stateManagement/url";
import { deleteCard } from "../list/listItem/card";
import { fetchingAllCards } from "../list";
import { getUsers } from "../../../stateManagement/actions/usersActionCreator";
import CardService from "../../../services/cards.service";
import UserService from "../../../services/user.service";
import MemberCheckbox from "./memberCheckbox";
import "./index.css";

const cardService = CardService.getInstance();
const userServices = UserService.getInstance();

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function CardModal() {
  const modalState = useSelector((state) => state.modalReducer);
  const users = useSelector((state) => state.usersReducer.users);
  const {
    modalTitle: title,
    modalId: id,
    modalDescription: description,
    modalListId: list_id,
  } = modalState;

  const classes = useStyles();
  const dispatch = useDispatch();
  let [desc, setDesc] = useState(description);
  let [titleValue, setTitleValue] = useState(title);

  const handleClose = () => {
    dispatch(closeModal());
    setDesc("");
  };

  useEffect(() => {
    setDesc(description);
  }, [description]);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  function deletingCardFromModal() {
    deleteCard(DEFAULT_URL, id, dispatch, list_id);
    handleClose();
  }

  function saveAllChangesInModal() {
    let data = {
      title: titleValue,
      description: desc,
    };
    cardService.update(id, data)
    .then(() => fetchingAllCards(DEFAULT_URL, dispatch))
    setDesc("");
    dispatch(closeModal());
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={modalState.modalIsOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalState.modalIsOpen}>
        <div className={classes.paper}>

          <form className="card-modal-form">

            <div className="title-div">
              <TextField
                className='title-textfield'
                style={{marginBottom: '10px'}}
                required
                id="outlined-required"
                label="Title*"
                variant="outlined"
                value={titleValue}
                onChange={(evt) => setTitleValue(evt.target.value)}
              />
              <Button onClick={handleClose}>X</Button>
            </div>
            <div className="card-description">
              <TextField
                className='description-textfield'
                id="outlined-basic"
                label="Card Description"
                value={desc}
                variant="outlined"
                onChange={(event) => {
                  setDesc(event.target.value);
                }}
              />
            </div>
            <div className="card-users">
              <h3 style={{ fontFamily: "roboto", marginBottom: "12px" }}>
                Members
              </h3>
              <div className="users">
                {users.map((user) => (
                <MemberCheckbox 
                  user={user} id={id} 
                  dispatch={dispatch} users={users} 
                  handleCheckboxClicks={handleCheckboxClicks}
                  />
                ))}
              </div>
            </div>
            <div className="card-modal-buttons">
              <Button
                variant="contained"
                style={{ marginRight: "5px" }}
                color="primary"
                onClick={saveAllChangesInModal}
              >
                SAVE ALL CHANGES
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={deletingCardFromModal}
              >
                DELETE CARD
              </Button>
            </div>
            
          </form>

        </div>
      </Fade>
    </Modal>
  );
}

const handleCheckboxClicks = (event, data, dispatch) => {
  let { users, user, id } = data;

  const checked = event.target.checked;
  const current_user = users.find((currentUser) => currentUser.id === user.id);
  const subscribed_to_cards = new Set(current_user.subscribed_to_cards);

  let argsForHandling = {
    id,
    user,
    subscribed_to_cards,
    checked,
    dispatch,
  };

  if (checked) {
    changeUserSubscription("ADD", argsForHandling, event);
  } else {
    changeUserSubscription("DELETE", argsForHandling, event);
  }
};

function changeUserSubscription(type, args) {
  let {
    user,
    id,
    subscribed_to_cards,
    dispatch,
  } = args;

  if (type === "DELETE") {
    subscribed_to_cards.delete(id);
    subscribed_to_cards = Array.from(subscribed_to_cards);
  } else if (type === "ADD") {
    subscribed_to_cards.add(id);
    subscribed_to_cards = Array.from(subscribed_to_cards);
  }

  userServices.update(user.id, { subscribed_to_cards })
  .then(() =>
    dispatch(getUsers())
  );
}
