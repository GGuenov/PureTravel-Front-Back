import React, { useEffect, useState } from "react";
import style from "./adminDashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllProperties, getAllReallyProperties, putProperty } from "../../redux/actions";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const allProperties = useSelector((state) => state.propertiesCopy);

  const [updated, setUpdated] = useState(false)
  const [price, setPrice] = useState(false);
  const [idHouse, setIdHouse] = useState("");
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
    console.log(form)
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
  const handleFile = (file) => {
    // Realizar las acciones necesarias con el archivo
    if(!file.type.startsWith("image/")){
      setErrors({...errors, image : "Tiene q ser una imagen"})
      return
    }
    if(file.type.startsWith('image/')) {
      const imageURL = URL.createObjectURL( new Blob([file]));
      setErrors({...errors, image : ""})
      setForm({...form , images : [... form.images , imageURL]})
      return
    }
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

  return (
    <div>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round"
      ></link>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      ></link>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></link> */}

      <div>
        {allProperties.map((props, index) => (
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
                    <div className="carousel-inner">
                      <div className="carousel-item active" >
                        <img
                          src={props.images[0]}
                          className="d-block w-100"
                          alt="..."
                        />
                      </div>
                      <div className="carousel-item">
                        <img
                          src={props.images[1]}
                          className="d-block w-100"
                          alt="..."
                        />
                      </div>
                      <div className="carousel-item">
                        <img
                          src={props.images[2]}
                          className="d-block w-100"
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
                    <div className="d-flex justify-content-between m-2">
                      <Link to={`/detail/${props.id}`}>
                        <button className="btn btn-primary">
                          Ver Detalles
                        </button>
                      </Link>
                      <button
  className={`btn btn-danger ${style.customButton}`}
  onClick={() => {
    // Llama a la función handleDelete para mostrar el modal de confirmación
    handleDeleteAsset(props.id);
  }}
>
  Eliminar
</button>
                      <button
                        className="btn btn-primary"
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
        ))}
      </div>
      <form
        onSubmit={(e) => {
          handleUpdate(idHouse);
          e.preventDefault();
        }}
      >
        <label htmlFor="inputName" className="form-label">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          onChange={(e) => handleChange(e)}
          value={form.name}
          className="form-control mb-1"
          id="inputName"
          placeholder="Nombre de tu propiedad"
        />
        <button type="submit">aca</button>
      </form>
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
      {updated ? <div className={`${style.alert} ${style.show}`}><Alerts/> </div> :"" }
        
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
              <form className="d-flex flex-row align-items-center justify-content-center text-center  " onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  console.log("Form submitted"); // Check if this message is logged
                  handleUpdate(idHouse);
                }}>
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
