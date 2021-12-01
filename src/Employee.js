import React, { Component } from "react";
import { variables } from "./Variables";

export class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      employees: [],
      modalTitle: "",
      employeeId: 0,
      employeeName: "",
      department: "",
      dateOfJoining: "",
      photoFileName: "anonymus.png",
      photoPath: variables.PHOTO_URL,
      newDate: "",
    };
  }

  refreshList() {
    fetch(variables.API_URL + "employee")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ employees: data });
      });

    fetch(variables.API_URL + "department")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ departments: data });
      });
  }

  changeEmployeeName = (e) => {
    this.setState({ employeeName: e.target.value });
  };

  changeDepartment = (e) => {
    this.setState({ department: e.target.value });
  };

  changeDateOfJoining = (e) => {
    this.setState({ dateOfJoining: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Add Employee",
      employeeId: 0,
      employeeName: "",
      department: "",
      dateOfJoining: "",
      photoFileName: "anonymus.png",
    });
  }

  editClick(employee) {
    employee.date_of_joining = this.convertDate(employee.date_of_joining);
    this.setState({
      modalTitle: "Edit Employee",
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      dateOfJoining: employee.date_of_joining,
      photoFileName: employee.photo_file_name,
    });
  }

  createClick() {
    fetch(variables.API_URL + "employee", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EmployeeName: this.state.employeeName,
        EmployeeDepartment: this.state.department,
        EmployeeDateOfJoining: this.state.dateOfJoining,
        EmployeePhotoFileName: this.state.photoFileName,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("failed");
        }
      );
  }

  updateClick() {
    fetch(variables.API_URL + "employee", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EmployeeId: this.state.employeeId,
        EmployeeName: this.state.employeeName,
        EmployeeDepartment: this.state.department,
        EmployeeDateOfJoining: this.state.dateOfJoining,
        EmployeePhotoFileName: this.state.photoFileName,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("failed");
        }
      );
  }

  deleteClick(employee) {
    if (
      window.confirm("Are you sure to delete the employee " + employee.name)
    ) {
      fetch(variables.API_URL + "employee/" + employee.id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result);
            this.refreshList();
          },
          (error) => {
            alert("failed");
          }
        );
    }
  }

  convertDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  componentDidMount() {
    this.refreshList();
  }

  imageUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);
    fetch(variables.API_URL + "employee/savefile", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ photoFileName: data });
      });
  };

  render() {
    const {
      departments,
      employees,
      modalTitle,
      employeeId,
      employeeName,
      department,
      dateOfJoining,
      photoPath,
      photoFileName,
    } = this.state;

    return (
      <div>
        <h3>This is Employee page</h3>

        <button
          type="button"
          className="btn btn-primary m2 float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => this.addClick()}
        >
          Add Employee
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>EmployeeId</th>
              <th>EmployeeName</th>
              <th>Department</th>
              <th>DOJ</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{this.convertDate(employee.date_of_joining)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-light mt-1"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.editClick(employee)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="btn btn-light mt-1"
                    onClick={() => this.deleteClick(employee)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="d-flex flex-row bd-highlight mb-3">
                  <div className="p-2 w-50 bd-highlight">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Employee Name</span>
                      <input
                        type="text"
                        className="form-control"
                        value={employeeName}
                        onChange={this.changeEmployeeName}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text">Department</span>
                      <select
                        className="form-select"
                        onChange={this.changeDepartment}
                        value={department}
                      >
                        {departments.map((dep) => (
                          <option key={dep.id}>{dep.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text">DOJ</span>
                      <input
                        type="date"
                        className="form-control"
                        value={dateOfJoining}
                        onChange={this.changeDateOfJoining}
                      />
                    </div>
                  </div>
                  <div className="p-2 w-50 bd-highlight">
                    <img
                      width="250px"
                      height="250px"
                      src={photoPath + photoFileName}
                    />
                    <input
                      className="m-2"
                      type="file"
                      onChange={this.imageUpload}
                    />
                  </div>
                </div>
                {employeeId === 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.createClick()}
                  >
                    Create
                  </button>
                ) : null}

                {employeeId !== 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.updateClick()}
                  >
                    Update
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
