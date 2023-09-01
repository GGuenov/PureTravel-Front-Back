import React, { useEffect } from 'react';
import style from './detail.module.css';
import imagen1 from '../../assets/images/Modern-Cabin.jpg';
import imagen2 from '../../assets/images/single-room-2-1920x1188.jpg';
import imagen3 from '../../assets/images/single-room-1-1920x1409.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { getAssetById } from '../../redux/actions';
import { useParams } from "react-router-dom";

const Detail = () => {

  const dispatch = useDispatch();
  const assetDetail = useSelector((state) => state.detail)
  console.log('Detalle', assetDetail);

  const {id} = useParams();

  useEffect(() => {
    dispatch(getAssetById(id))
  }, [])

    return (
      <div>
        <div className={`container text-center  ${style.container}`} >
          <div className={`row border${style.row}`}>
            <div className={`col-4 border ${style.col}`}>
              <div className={`row ${style.innerRow}`}>
                <div className={`col-12 ${style.innerCol}`}>
                    <img className={style.image} src={assetDetail.images?.[0]} alt="Imagen 3" data-bs-toggle="modal" data-bs-target="#exampleModal"/>
                </div>
              </div>
              <div className={`row border ${style.innerRow}`}>
                <div className={`col-12 ${style.innerCol}`}>
                  <img className={style.image} src={assetDetail.images?.[1]} alt="Imagen 3" />
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <img className={style.image} src={assetDetail.images?.[2]} alt="Imagen 1" />
            </div>
          </div>
          <div className={`row border ${style.row}`}>
            <div className={`col-8 border ${style.col}`}>
            <h1 className={style.heading}>{assetDetail.name}</h1>
                <p className={style.paragraph}>{assetDetail.description}</p>
                <p className={style.paragraph}>{assetDetail.address}</p>
                <p className={style.paragraph}>{assetDetail.location}</p>
                <p className={style.paragraph}>{assetDetail.country}</p>
            </div>
            <div className={`col-4 border ${style.col}`}>
              <h1 className={style.heading}>Amenidades</h1>
                <p className={style.paragraph}>•Habitaciones: {assetDetail.rooms}</p>
                <p className={style.paragraph}>•Baños: {assetDetail.bathrooms}</p>
                <p className={style.paragraph}>•Tamaño propiedad: {assetDetail.coveredArea} mt2</p>
                <p className={style.paragraph}>•Total Area: {assetDetail.totalArea}</p>
                <p className={style.paragraph}>Precio por noche: $ {assetDetail.rentPrice}</p>
                
            </div>
          </div>
          <div className={`row border ${style.row}`}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15908.325523601628!2d-74.18270045!3d4.5794067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sco!4v1693329189613!5m2!1ses-419!2sco"
              width="400"
              height="300"
              style={{ border: '0' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className={`row border ${style.row}`}>
            <div className={`col-4 border ${style.col}`}>
                <h1 className={style.headingStyle}>Reseña de Playa Serena Oasis</h1>
                <p className={style.paragraph}>{assetDetail.reviews}</p>
            </div>
            <div className={`col-4 border ${style.col}`}>
                <h1 className={style.headingStyle}>Reseña de Cabaña Molino Rojo</h1>
                <p>"Perderse en la naturaleza nunca había sido tan encantador. La Cabaña Bosque Encantado nos brindó la escapada perfecta del ajetreo y el bullicio de la ciudad. Cada mañana nos despertábamos con el canto de los pájaros y una taza de café en la terraza. El interior de la cabaña estaba decorado con un estilo rústico pero moderno, y nos sentimos como en casa desde el primer momento. Definitivamente, recomiendo esta joya escondida a todos los amantes de la naturaleza." - Carlos M.</p>
            </div>
            <div className={`col-4 border ${style.col}`}>
                <h1 className={style.headingStyle}>Reseña de Loft Urbano Vibrante</h1>
                <p>"Mi viaje de negocios se convirtió en una experiencia emocionante gracias a este loft. Ubicado en el corazón de la ciudad, tenía fácil acceso a todas las comodidades y lugares de interés. La decoración era elegante y moderna, y me encantó la vista panorámica desde el balcón. El anfitrión fue extremadamente atento, y la comunicación fue fluida desde el momento de la reserva hasta el check-out. Sin duda, volveré a reservar este lugar en mi próximo viaje." - Sofia R.</p>
            </div>
          </div>
          
        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-body">
              <img className={style.image} src={imagen3} alt="Imagen 3" />
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };

export default Detail;