// import React, { useEffect, useContext } from 'react'
// import UserContext from '../store/user-context'
// import TokenContext from '../store/token-context'
// import { FaBitcoin } from 'react-icons/fa'
// import { toEther } from '../lib/utils'
// import AOS from 'aos'

// import FetchingDataLoader from './common/FetchingDataLoader'
// import { Link } from 'react-router-dom'

// function Dash() {
//   const userCtx = useContext(UserContext)
//   const tokenCtx = useContext(TokenContext)

//   useEffect(() => {
//     AOS.init({ duration: 700, disable: 'mobile' })
//     AOS.refresh()
//   }, [])

//   if (userCtx.userIsLoading) {
//     return <FetchingDataLoader />
//   }

//   return (
//     <>
//       <div className="row my-5 gy-5 align-items-center" data-aos="fade-up">
//         <div className="col-lg-6">
//           <h1 data-aos="fade-up" className="text-xl token-title">
//             ASIX+ Token
//           </h1>
//           <p
//             className="token-intro-text lead"
//             data-aos="fade-up"
//             data-aos-delay="100"
//           >
//             ASIX+ Token is a token which is made by PT. META NUSANTARA VICTORI,
//             which has purpose and the projects of P2E games, NFT Marketplace,
//             and Metaverse.ASIX+ Token is the main utility in our 3 projects. P2E
//             Games, NFT Market, and Nusantaraverse. ASIX+ Token can be used in
//             all three projects.In addition, it does not rule out the possibility
//             of developing or adding projects in the future.
//           </p>
//           <Link className="btn btn-primary py-2 mt-5" to="/presale">
//             Go To PRESALE
//           </Link>
//         </div>
//         <div className="col-lg-6 text-center">
//           <img
//             className="img-fluid w-100 mb-5 main-logo-animation"
//             src="/main-logo.png"
//             alt="Illustration"
//           />
//         </div>
//       </div>
//       <div className="row my-5 gy-5 align-items-center" data-aos="fade-up">
//         <div class="col-lg-4">
//           <div className="introduce-clip-box text-center token-intro-text">
//             <p style={{ fontSize: '20px' }}> Audio/Video Streaming </p>
//             <p>
//               {' '}
//               {
//                 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!'
//               }
//             </p>
//           </div>
//         </div>

//         <div class="col-lg-4">
//           <div className="introduce-clip-box text-center token-intro-text">
//             <p style={{ fontSize: '20px' }}> NFT market </p>
//             <p>
//               {' '}
//               {
//                 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!'
//               }
//             </p>
//           </div>
//         </div>
//         <div class="col-lg-4">
//           <div className="introduce-clip-box text-center token-intro-text">
//             <p style={{ fontSize: '20px' }}> Nusantaraverse </p>
//             <p>
//               {' '}
//               {
//                 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!'
//               }
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Dash
