import React, { useEffect, useState } from "react";
import style from "./adminDashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  deleteAssetById,
  getAllProperties,
  getAllReallyProperties,
  putProperty,
} from "../../redux/actions";
import axios from "axios";
import AllUser from "./AllUsers/allUser";
// import {
//   getAllProperties,
//   getAllReallyProperties,
//   putProperty,
// } from "../../redux/actions";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const allProperties = useSelector((state) => state.propertiesCopy);
  const [componenteActual, setComponenteActual] = useState('A');
  const [updated, setUpdated] = useState(false);
  const [price, setPrice] = useState(false);
  const [idHouse, setIdHouse] = useState("");
  const [previousProperties, setPreviousProperties] = useState([]);
  const [selectedCkeckbox, setSelectedCheckbox] = useState({
    onSale: "",
    parking: "",
    terrace: "",
  });
  const [form, setForm] = useState({
    name: "",
    description: "",
    country: "",
    state: "",
    address: "",
    location: "",
    onSale: false,
    images: [],
    sellPrice: 1,
    rentPrice: 1,
    rooms: 0,
    bathrooms: 0,
    coveredArea: 0,
    totalArea: 0,
  });

  useEffect(() => {
    const getDataForFrom = async () => {
      const { data } = await axios(`/assets/` + idHouse);
      setForm({
        name: data.name,
        country: data?.country,
        state: data?.state,
        address: data?.address,
        location: data?.location,
        description: data.description,
        onSale: data.onSale,
        images: data.images,
        sellPrice: data?.sellPrice,
        rentPrice: data?.rentPrice,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        coveredArea: data.coveredArea,
        totalArea: data.totalArea,
      });
    };
    getDataForFrom();
    console.log(form);
  }, [idHouse]);

  const [errors, setErrors] = useState({
    image: "",
  });
  const handleCheckbox = (e) => {
    if (e.target.name === "onSale" && e.target.value === "true") {
      setPrice(true);
    } else if (e.target.name === "onSale" && e.target.value === "false") {
      setPrice(false);
    }
    setSelectedCheckbox({
      ...selectedCkeckbox,
      [e.target.name]: e.target.value,
    });
  };
  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;

    if (e.target.type === "checkbox") {
      setForm({ ...form, [name]: JSON.parse(value) });
      return;
    }
    setForm((prevData) => ({ ...prevData, [name]: value }));
  };
  // Función para manejar el archivo seleccionado
  const handleFile = async (file) => {
    console.log('Imagen',file);
    const fileEdit = new FormData()
    fileEdit.append("file", file)
    fileEdit.append("upload_preset", "Imagenes")
    fileEdit.append("cloud_name", "dkdounmsa")
    const {data} = await axios.post(`https://api.cloudinary.com/v1_1/dkdounmsa/image/upload`, fileEdit)
    setForm({...form, images: [...form.images, data.secure_url]})

  };
  // Función para manejar el evento de soltar la imagen
  const handleDrop = (event) => {
    event.preventDefault();
    if (form.images.length === 3) {
      setErrors({ ...errors, image: "Solo puedes tres imagenes" });
      return;
    }
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };
  function handleDelete(index) {
    const updatedImages = [...form.images];
    updatedImages.splice(index, 1); // Elimina la imagen en el índice especificado
    setForm({ ...form, images: updatedImages });
  }
  const handleUpdate = async (id) => {
    console.log("entre al handle");
    try {
      dispatch(putProperty(id, form));
    } catch (error) {
      console.log(error);
    }
  };

  const descripCut = (description) => {
    if (description.length > 220) {
      const newDesc = description.split("").slice(0, 220).join("");
      return <p className="card-text">{newDesc}...</p>;
    }
    return <p className="card-text">{description}</p>;
  };
  const handleDeleteAsset = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta propiedad?")) {
      // Llama a la acción para eliminar la propiedad por su ID
      dispatch(deleteAssetById(id));
    }
  };
  useEffect(() => {
    dispatch(getAllReallyProperties());
  }, []);

  useEffect(() => {
    // Lógica para detectar eliminaciones
    const deletedItems = previousProperties.filter(item => !allProperties.includes(item));
    // Hacer algo con los elementos eliminados si es necesario
    console.log('Elementos eliminados:', deletedItems);
    
    // Actualizar el estado anterior con el estado actual
    setPreviousProperties(allProperties);
  }, [allProperties]);

  return (
    <div className={style.background}>
      
      <div className="row" style={{ marginTop: "3rem", width: "100%"}}>
        <div className="col-md-3">
        <div
              className={`card ${style.fixedCard}`}
              style={{ position: "sticky", top: "5rem", marginBottom: "1rem" }}
            >
              <div className="card-body mt-2">
                
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="85" height="85" fill="currentColor" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
                  <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                </svg>
                <h5 className="card-title pt-1">Name User</h5>
              </div>
              <ul>
                <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-target="#exampleModalToggle7"
                        data-bs-toggle="modal"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "80px",
                        }}
                        href="/userPanel"
                      >
                        <div>
                        
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-fill-gear" viewBox="0 0 16 16">
                          <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
                        </svg>
                            &nbsp; Edit Profile
                          
                        </div>
                      </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={() => setComponenteActual('A')}  style={{
                        display: "flex",
                        alignItems: "center",
                        height: "80px",
                      }}>
                      <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-houses-fill" viewBox="0 0 16 16">
                        <path d="M7.207 1a1 1 0 0 0-1.414 0L.146 6.646a.5.5 0 0 0 .708.708L1 7.207V12.5A1.5 1.5 0 0 0 2.5 14h.55a2.51 2.51 0 0 1-.05-.5V9.415a1.5 1.5 0 0 1-.56-2.475l5.353-5.354L7.207 1Z"/>
                        <path d="M8.793 2a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708L8.793 2Z"/>
                      </svg>
                      &nbsp; All Propertys
                      </div>
                    </a>
                  </li>
                <li class="nav-item">
                    <a class="nav-link" onClick={() => setComponenteActual('B')} href="#"   style={{
                        display: "flex",
                        alignItems: "center",
                        height: "80px",
                      }}>
                      <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                      </svg>
                      &nbsp; All Users
                      </div>
                    </a>
                  </li>
              </ul>

              </div>
            </div>
        </div>
        {componenteActual === "A"?
        <div className="col-md-9">
          <div>
            {allProperties?.map((props, index) => (
              <div className={`${style.centeredContent}`} key={props.id}>
                <div className={`card mb-3 ${style.maxWidth}`}>
                  <div className="row g-0">
                    <div className="col-md-4">
                      <div
                        id={`carouselExampleIndicators-${index}`}
                        className="carousel slide"
                      >
                        <div className="carousel-indicators">
                          <button
                            type="button"
                            data-bs-target={`#carouselExampleIndicators-${index}`}
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                          ></button>
                          <button
                            type="button"
                            data-bs-target={`#carouselExampleIndicators-${index}`}
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                          ></button>
                          <button
                            type="button"
                            data-bs-target={`#carouselExampleIndicators-${index}`}
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                          ></button>
                        </div>
                        <div className={`carousel-inner ${style.containerImg}`}>
                          <div className="carousel-item active">
                            <img
                            style={{width: "100%" , height : "238px", objectFit: "cover", backgroundPosition:"center bottom"}}
                              src={props.images[0]}
                              className="d-block " 
                              alt="..."
                            />
                          </div>
                          <div className="carousel-item">
                            <img
                              src={props.images[1]}
                              style={{width: "100%" , height : "238px", objectFit: "cover", backgroundPosition:"center bottom"}}
                              className="d-block w-100"
                              alt="..."
                            />
                          </div>
                          <div className="carousel-item">
                            <img
                            style={{width: "100%" , height : "238px", objectFit: "cover", backgroundPosition:"center bottom"}}
                              src={props.images[2]}
                              className="d-block "
                              alt="..."
                            />
                          </div>
                        </div>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#carouselExampleIndicators-${index}`}
                          data-bs-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target={`#carouselExampleIndicators-${index}`}
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Next</span>
                        </button>

                        <button
                          className={style.customButton}
                          data-bs-target="#exampleModalToggle4"
                          data-bs-toggle="modal"
                          onClick={() => setIdHouse(props.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            fill="currentColor"
                            className={`bi bi-pencil-fill ${style.icon}`}
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{props.name}</h5>
                        {descripCut(props.description)}
                        <p className="card-text">
                          <small className="text-muted">
                            {props.address}, {props.country}
                          </small>
                        </p>
                        <div className={`  m-2 ${style.divButton}`}>
                          <Link to={`/detail/${props.id}`}>
                            <button className="btn btn-primary">
                              Ver Detalles
                            </button>
                          </Link>
                          <div className={style.left}>
                            <button
                              className={`btn btn-danger ${style.left} `}
                              onClick={() => {
                                // Llama a la función handleDelete para mostrar el modal de confirmación
                                handleDeleteAsset(props.id);
                              }}
                            >
                              Eliminar
                            </button>
                            <button
                              className={`btn btn-primary ${style.left}`}
                              data-bs-target="#exampleModalToggle"
                              data-bs-toggle="modal"
                              onClick={() => setIdHouse(props.id)}
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        :
        <div className="col-md-9">
          <AllUser/>
        </div>
        }
      </div>
      
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                Cambiar Datos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Inicio del formulario
              <form className="d-flex flex-row align-items-center justify-content-center text-center  ">
                <div className="column">
                  <div className="col-md-12 text-center">
                    <div className="row justify-content-center ">
                      <div className="col-md-8 text-center">
                        <label htmlFor="inputName" className="form-label">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          className="form-control mb-1"
                          id="inputName"
                          placeholder="Nombre de tu propiedad"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-around align-items-center">
                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputAddress" className="form-label">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        className="form-control "
                        id="inputAddress"
                        placeholder="1234 Main St"
                        onChange={(e) => handleChange(e)}
                        required
                        disabled
                      />
                    </div>

                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputAddress2" className="form-label">
                        Pais
                      </label>
                      <input
                        type="text"
                        name="country"
                        disabled
                        value={form.country}
                        className="form-control"
                        id="inputAddress2"
                        onChange={(e) => handleChange(e)}
                        placeholder="Pais de locacion"
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-around align-items-center">
                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputAddress" className="form-label">
                        Provincia
                      </label>
                      <input
                        type="text"
                        name="location"
                        className="form-control "
                        id="inputAddress"
                        disabled
                        value={form.location}
                        placeholder="1234 Main St"
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </div>

                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputAddress2" className="form-label">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="state"
                        disabled
                        value={form.state}
                        className="form-control"
                        id="inputAddress2"
                        onChange={(e) => handleChange(e)}
                        placeholder="Pais de locacion"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Cambiar Datos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="d-flex flex-row align-items-center justify-content-center text-center  ">
                <div className="column">
                  <div className="d-flex flex-row justify-content-around align-items-center">
                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputState" className="form-label">
                        Tipo de propiedad
                      </label>

                      <select
                        id="inputState"
                        onChange={(e) => handleChange(e)}
                        name="type"
                        className="form-select"
                      >
                        <option>Elije uno...</option>
                        <option name="type" value="Departamento">
                          Departamento
                        </option>
                        <option name="type" value="Casa">
                          Casa
                        </option>
                        <option name="type" value="Hotel">
                          Hotel
                        </option>
                      </select>
                    </div>

                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputHab" className="form-label">
                        N° de habitaciones
                      </label>
                      <input
                        type="number"
                        name="rooms"
                        value={form.rooms}
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        id="inputHab"
                        placeholder="N° habitaciones"
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-around align-items-center">
                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputHab" className="form-label">
                        N° de baños
                      </label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={form.bathrooms}
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        id="inputHab"
                        placeholder="N° baños"
                        required
                      />
                    </div>

                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputAddress2" className="form-label">
                        Posee estacionamiento?
                      </label>
                      <select
                        id="inputState"
                        onChange={(e) => handleChange(e)}
                        value={form.parking}
                        name="type"
                        className="form-select"
                      >
                        <option>Elije uno...</option>
                        <option name="type" value={true}>
                          Yes
                        </option>
                        <option name="type" value={false}>
                          No
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-around align-items-center">
                    <div className="col-md-6 m-2 p-1">
                      <label htmlFor="inputAddress2" className="form-label">
                        Posee terraza?
                      </label>
                      <select
                        id="inputState"
                        onChange={(e) => handleChange(e)}
                        name="type"
                        value={form.terrace}
                        className="form-select"
                      >
                        <option>Elije uno...</option>
                        <option name="type" value="Departamento">
                          Yes
                        </option>
                        <option name="type" value="Casa">
                          No
                        </option>
                      </select>
                    </div>

                    <div className="col-md-6 m-2 p-1">
                      <label className="form-label">Esta a la venta?</label>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="onSale"
                          checked={selectedCkeckbox.onSale === "true"}
                          onChange={(e) => {
                            handleCheckbox(e);
                            handleChange(e);
                          }}
                          className="form-check-input"
                          id="checkbox1"
                          value={true}
                        />
                        <label htmlFor="checkbox1" className="form-check-label">
                          {" "}
                          YES
                        </label>
                      </div>

                      <div className="form-check ">
                        <input
                          type="checkbox"
                          name="onSale"
                          checked={selectedCkeckbox.onSale === "false"}
                          onChange={(e) => {
                            handleCheckbox(e);
                            handleChange(e);
                          }}
                          className="form-check-input"
                          id="checkbox2"
                          value={false}
                        />
                        <label htmlFor="checkbox2" className="form-check-label">
                          NO{" "}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex  flex-row justify-content-center align-items-center">
                    <div className="col-md-5 m-3 p-1">
                      <label htmlFor="inputPriceR" className="input-label">
                        Precio de Renta
                      </label>
                      <input
                        type="number"
                        name="rentPrice"
                        id="inputPriceR"
                        className="form-control"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={form.rentPrice}
                      ></input>
                    </div>

                    <div
                      className={`col-md-5 m-3 p-1 ${
                        price ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="inputPriceS" className="input-label">
                        {" "}
                        Precio de Venta{" "}
                      </label>
                      <input
                        type="number"
                        id="inputPriceS"
                        name="sellPrice"
                        value={form.sellPrice}
                        className=" form-control"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Anterior
              </button>
              <button
                className="btn btn-primary"
                data-bs-target="#exampleModalToggle3"
                data-bs-toggle="modal"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle3"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Cambiar Datos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                // className="d-flex flex-row align-items-center justify-content-center text-center"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  console.log("Form submitted"); // Check if this message is logged
                  handleUpdate(idHouse);
                }}
              >
                <div className="column">
                  <div className="d-flex flex-row justify-content-around align-items-center">
                    <div className="col-md-12 m-2 p-1">
                      <div className="form-group ">
                        <label htmlFor="description" className="form-label">
                          {" "}
                          Descripción
                        </label>
                        <textarea
                          className="form-control"
                          rows="6"
                          cols="50"
                          value={form.description}
                          name="description"
                          onChange={(e) => handleChange(e)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    data-bs-target="#exampleModalToggle2"
                    data-bs-toggle="modal"
                  >
                    Anterior
                  </button>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    // data-bs-target="#exampleModalToggle"
                    // data-bs-toggle="modal"
                    onClick={() => alertHandler()}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {updated ? (
        <div className={`${style.alert} ${style.show}`}>
          <Alerts />{" "}
        </div>
      ) : (
        ""
      )}
      <div class="modal fade" id="exampleModalToggle7" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel">Editar Perfil</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                  <div class="col-6">
                    <div
                      id="drag-drop-area"
                      style={{
                        border: "2px dashed #ccc",
                        textAlign: "center",
                        paddingTop: "93px",
                        cursor: "pointer",
                        marginTop:"10px",
                        marginBottom:"10px",
                        borderRadius: "100%",
                        height: "100%"
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleFile(e.dataTransfer.files[0])}
                    >
                      Arrastra y suelta una imagen aquí o
                      <label htmlFor="fileInput" style={{ color: "blue", cursor: "pointer", justifyContent: "center" }}>
                        selecciona un archivo
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <div className="mb-2">
                      <label htmlFor="nombre" className="form-label" style={{color: "black"}}>
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="correo" className="form-label" style={{color: "black"}}>
                        Correo
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="correo"
                        placeholder="Correo electrónico"
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="contrasena" className="form-label" style={{color: "black"}}>
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="contrasena"
                        placeholder="Contraseña"
                      />
                    </div>
                  </div>
                </div>
              </div>
            <div class="modal-footer justify-content-center">
              <button class="btn btn-primary">Actualizar</button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle4"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Cambiar Datos
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                className="d-flex flex-row align-items-center justify-content-center text-center  "
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  console.log("Form submitted"); // Check if this message is logged
                  handleUpdate(idHouse);
                }}
              >
                <div className="column">
                  <div className="d-flex flex-row justify-content-around align-items-center">
                    <div className="col-md-12 m-2 p-1">
                      <div className="form-group ">
                        <label htmlFor="description" className="form-label">
                          {" "}
                          Editar Imagenes
                        </label>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => handleFile(e.target.files[0])}
                          />

                          <div
                            className={`d-flex text-center justify-content-center align-items-center ${style.divDrop}`}
                            style={{
                              border: "2px dashed #ccc",
                              margin: `20px 40px`,
                              textAlign: "center",
                              width: "400px",
                              height: "250px",
                            }}
                            onDragEnter={(e) => e.preventDefault()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                          >
                            {form.images?.length > 0 ? (
                              <Carousel
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  maxHeight: "250px",
                                }}
                              >
                                {form.images?.map((imageUrl, index) => (
                                  <Carousel.Item key={index}>
                                    <img
                                      className={style.carouselImage}
                                      style={{ height: "245px", width: "100%" }}
                                      src={imageUrl}
                                      alt={`Image ${index}`}
                                    />
                                    <button
                                      className={style.buton}
                                      onClick={() => handleDelete(index)}
                                    >
                                      X
                                    </button>
                                  </Carousel.Item>
                                ))}
                              </Carousel>
                            ) : (
                              "Arrastra y suelta la imagen aquí"
                            )}
                          </div>
                          {errors.image ? (
                            <p style={{ color: "red" }}>{errors.image}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-target="#exampleModalToggle7"
                      data-bs-toggle="modal"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
