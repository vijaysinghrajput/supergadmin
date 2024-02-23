import { useContext } from "react";
import { useState } from "react";
import ContextData from "../../context/MainContext";
import URLDomain from "../../URL";
import { Input, InputGroup, InputLeftAddon, Button } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Sallery() {

    const { sallaryList, employes, salaryHistory, reloadData } = useContext(ContextData);
    const [selectedEMP, setEmp] = useState({});
    const [sallary, setSallary] = useState({
        basic: 0,
        hra: 0,
        special: 0,
        pf: 0,
        lwf: 0,
        other: 0
    });
    const [employee, setemployee] = useState({});
    const [selectedPosts, setSelectedPosts] = useState([new Date().getMonth()]);
    const mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        console.log("heyeyeyey", employee)
    }, [employee])

    const addToList = () => {
        console.log("all data", {
            ...selectedEMP,
            ...sallary,
            employee_id: selectedEMP.id,
            employee_name: selectedEMP.name
        })
        fetch(URLDomain + "/APP-API/App/addToSallaryList", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ...selectedEMP,
                ...sallary,
                employee_id: selectedEMP.id,
                employee_name: selectedEMP.name
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                document.getElementsByClassName("btn-close")[0].click();
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    const paySalary = () => {
        const currentDate = new Date();
        fetch(URLDomain + "/APP-API/App/paySalary", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ...employee,
                salary: employee.payableSalary,
                month_for: selectedPosts[0] + 1,
                year_for: currentDate.getFullYear(),
                salary_status: 1,
                date: +new Date() / 1000,
                salary_slip_id: Math.floor(Math.random() * (9999989 - 900000 + 1) + 900000)
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson);
                if (responseJson.success) {
                    reloadData();
                    document.getElementsByClassName("btn-close")[0].click();
                }
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    const monthDiff = (d1, d2) => {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card-body" style={{ background: "#fff", marginBottom: 10 }}>
                    <div className="row g-2">
                        <div className="col-sm-4">
                            <div className="search-box">
                                <input type="text" className="form-control" placeholder="Search for name, tasks, projects or something..." />
                                <i className="ri-search-line search-icon" />
                            </div>
                        </div>{/*end col*/}
                        <div className="col-sm-auto ms-auto">
                            <div className="list-grid-nav hstack gap-1">
                                <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#sallary"><i className="ri-add-fill me-1 align-bottom" /> Add Members to list</button>
                            </div>
                        </div>{/*end col*/}
                    </div>{/*end row*/}
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="live-preview">
                            <div className="table-responsive">
                                <table className="table align-middle table-nowrap mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>ID</th>
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Join Date</th>
                                            {/* <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Status</th> */}
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Employee</th>
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Role</th>
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Salary</th>
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Total Paid this year</th>
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Pending Payment</th>
                                            <th scope="col" style={{ textTransform: "uppercase", textAlign: "center" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sallaryList?.map((items, i) => {
                                            console.log("hey eployee", employes);
                                            console.log("hey navneet", items);
                                            const employee = employes.find(o => o.id === items.empolyee_id);
                                            const history = salaryHistory.find(o => o.employee_id === items.empolyee_id);
                                            const date = new Date(Number(employee?.join_date));
                                            const getTime = history ? monthDiff(new Date(`${history.month_for}/01/${history.year_for}`), new Date()) : monthDiff(new Date(Number(employee?.join_date)), new Date());
                                            console.log(employee?.name, getTime, history)
                                            const salary = Number(items.basic) + Number(items.hra) + Number(items.lwf) + Number(items.pf) + Number(items.special) + Number(items.other);
                                            return (
                                                <>
                                                    {employee &&
                                                        <tr>
                                                            <td style={{ textAlign: "center" }}><a href="#" className="fw-medium">#{items.id}</a></td>
                                                            <td style={{ textAlign: "center" }}>{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</td>
                                                            {/* <td style={{ textAlign: "center" }} className="text-success"><i className="ri-checkbox-circle-line fs-17 align-middle" /> Paid</td> */}
                                                            <td style={{ textAlign: "center" }}>
                                                                <div className="d-flex gap-2 align-items-center justify-content-center">
                                                                    <div className="">
                                                                        <img src="/assets/images/users/avatar-3.jpg" alt="" className="avatar-xs rounded-circle" />
                                                                    </div>
                                                                    <div className="">
                                                                        {employee.name}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{ textAlign: "center" }}>{employee.roal_name}</td>
                                                            <td style={{ textAlign: "center" }}>₹ {salary}</td>
                                                            <td style={{ textAlign: "center" }}>₹ {salary}</td>
                                                            <td style={{ textAlign: "center" }}>₹ {getTime * salary}</td>
                                                            <td style={{ textAlign: "center" }}> <button type="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false" className="btn btn-soft-info btn-icon fs-14"><i className="ri-more-2-fill" /></button>
                                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                                                                    <li><div className="dropdown-item" data-bs-toggle="modal" data-bs-target="#pay" onClick={() => setemployee({ ...items, payableSalary: salary, lastPaidMonth: history ? history.month_for : date.getMonth() + 1 })}>Pay</div></li>
                                                                    <li><a className="dropdown-item" href="#">Last Week</a></li>
                                                                    <li><a className="dropdown-item" href="#">Last Month</a></li>
                                                                    <li><a className="dropdown-item" href="#">Last Year</a></li>
                                                                </ul></td>
                                                        </tr>
                                                    }
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {/* end table */}
                            </div>
                            {/* end table responsive */}
                        </div>
                        <div className="modal fade" id="pay" tabIndex={-1} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered w-50">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="myModalLabel">Pay</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="modal-body">
                                        <div className="card-body">
                                            <div class="btn-group">
                                                <div className="row">
                                                    {mL?.map((months, i) => {
                                                        const lastMonth = employee.lastPaidMonth;
                                                        return (
                                                            <div className="col-md-3 mt-2">
                                                                <div style={lastMonth >= i + 1 ? { opacity: "0.5", pointerEvents: "none" } : null} className={selectedPosts.includes(i) ? "selected month" : "month"} key={i} onClick={() => { setSelectedPosts(s => [i]) }}>
                                                                    {lastMonth >= i + 1 ? <h4 style={{ color: "#0a890a" }}>Paid</h4> : <h4>{months}</h4>}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    {/* <div className="text-center mb-3">
                                                        <a href="javascript:void(0);" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /></a>
                                                    </div> */}
                                                    <div className="row mt-4">
                                                        <div className="col-6">
                                                            <div className="mb-3">
                                                                <InputGroup>
                                                                    <InputLeftAddon children='₹' />
                                                                    <Input type='number' value={employee.payableSalary} placeholder='' isDisabled />
                                                                </InputGroup>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 d-flex justify-content-end">
                                                            <Button onClick={() => paySalary(employee)} colorScheme='blue' variant='solid'>
                                                                Pay
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>{/*end modal-content*/}
                            </div>{/*end modal-dialog*/}
                        </div>{/*end modal*/}
                        <div className="modal fade" id="sallary" tabIndex={-1} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered w-50">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="myModalLabel">Add New Members</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                    </div>
                                    <div className="modal-body">
                                        <div className="card-body">
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-light dropdown-toggle"
                                                    data-bs-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">{selectedEMP.name ? selectedEMP.name : "Select Employee"}</button>
                                                <div class="dropdown-menu">
                                                    {employes?.map((emp, i) => {
                                                        const employeeExist = sallaryList.find(o => o.empolyee_id === emp.id);
                                                        console.log("enmm", emp, "sallaryList", sallaryList, "Emp", employeeExist)
                                                        return (
                                                            <>
                                                                {!employeeExist && <a class="dropdown-item" onClick={() => setEmp(emp)} href="#">{emp.name}</a>}
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="firstNameinput" className="form-label">Basic</label>
                                                        <input type="number" onChange={e => setSallary({ ...sallary, basic: e.target.value })} value={sallary.basic} className="form-control" placeholder="Basic" id="firstNameinput" />
                                                    </div>
                                                </div>{/*end col*/}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="mobilenumberInput" className="form-label">HRA</label>
                                                        <input type="number" onChange={e => setSallary({ ...sallary, hra: e.target.value })} value={sallary.hra} className="form-control" placeholder="HRA" id="mobilenumberInput" />
                                                    </div>
                                                </div>{/*end col*/}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="firstNameinput" className="form-label">Special</label>
                                                        <input type="number" onChange={e => setSallary({ ...sallary, special: e.target.value })} value={sallary.special} className="form-control" placeholder="Special" id="firstNameinput" />
                                                    </div>
                                                </div>{/*end col*/}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="mobilenumberInput" className="form-label">PF</label>
                                                        <input type="number" onChange={e => setSallary({ ...sallary, pf: e.target.value })} value={sallary.pf} className="form-control" placeholder="PF" id="mobilenumberInput" />
                                                    </div>
                                                </div>{/*end col*/}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="firstNameinput" className="form-label">LWF</label>
                                                        <input type="number" onChange={e => setSallary({ ...sallary, lwf: e.target.value })} value={sallary.lwf} className="form-control" placeholder="LWF" id="firstNameinput" />
                                                    </div>
                                                </div>{/*end col*/}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="mobilenumberInput" className="form-label">Other</label>
                                                        <input type="number" onChange={e => setSallary({ ...sallary, other: e.target.value })} value={sallary.other} className="form-control" placeholder="Other" id="mobilenumberInput" />
                                                    </div>
                                                </div>{/*end col*/}
                                                <div className="col-12">
                                                    <button className="btn btn-success" onClick={addToList}><i className="ri-add-fill me-1 align-bottom" /> Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>{/*end modal-content*/}
                            </div>{/*end modal-dialog*/}
                        </div>{/*end modal*/}
                    </div>{/* end card-body */}
                </div>{/* end card */}
            </div>{/* end col */}
        </div >
    )
}