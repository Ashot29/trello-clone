import { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useSelector,useDispatch } from "react-redux";
import { getUsers } from "../../../stateManagement/actions/usersActionCreator";
import UserSequenceService from "../../../services/user-sequence.service";
import { openUserModal } from "../../../stateManagement/actions/userModalActionCreator";
import { RootState } from "../../../stateManagement/reducers/rootReducer";
import UserRow from "./table-row";

export type User = {
  age: number
  country: string
  created_at: number
  email: string
  firstName: string
  id: string
  lastName: string
  subscribed_to_cards: any[]
  updated_at: number
  userModalMode: string

}

export default function BasicTable() {
  const users = useSelector((state: RootState) => {
    const sortedUsers = state.usersReducer.users.sort(
      (a: User, b: User) => b.created_at - a.created_at
    );
    return sortedUsers;
  });
  const userSequenceService: any = UserSequenceService.getInstance();
  const handleOpen = (args: User) => dispatch(openUserModal(args));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
    userSequenceService.getById(1);
  }, []);

  return (
    <TableContainer component={Paper} >
      <Table style={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">FullName</TableCell>
            <TableCell align="center">Country</TableCell>
            <TableCell align="center">Age</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Change Info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: User) => (
            <UserRow key={user.id} user={user} handleOpen={handleOpen} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}