import React, {useState} from 'react';
import styled from 'styled-components';
import Navbar from './Navbar/Navbar'
import { MdClose } from 'react-icons/md';
import image5 from './roulette-image.jpg';
import image6 from './user-avatar-placeholder.png';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  
  
`;

const ModalWrapper = styled.div`
  width: 1000px;
  height: 700px;
  color: #000;
  position: relative;
  z-index: 10;
  border-radius: 10px;
  background-color:white;
`;

const ModalImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px 0 0 10px;
  background: #000;
`;

const ModalContent = styled.div`
  
  color: #141414;
  background-color:white;
  h1{
    background-color:white;
  }
  p {
    margin-bottom: 1rem;
    background-color:white;
    
  }
  table{
    background-color:white;
  }
  tr{
    background-color:white;
  }
  td{
    background-color:white;
  }
  tbody{
    background-color:white;
  }
  div{
    background-color:white;
  }
  span{
    background-color:white;
  }
  b{
    background-color:white;  
  }


  
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
  background-color: white;`

  

const RankingsModal = (props) =>{
    
    /*const 
    state ={
        Players:[

            {
                imgSrc:'./user-avatar-placeholder.png',
                Name: 'Pierce Taylor',
                Score: '100'
            }

        ]
    }
  */
  return(

        <Background>
          <ModalWrapper>
             
            <ModalContent>
            <h1>Leaderboard</h1>
                <div>
                    <div className="card">
                        <div className="card-body">
                            <table className="table table-borderless">
                                <col style={{width:'10%'}}/>
                                <col style={{width:'80%'}}/>
                                <col style={{width:'10%'}}/>
                                <tbody>
                                        
                                    <tr>
                                        <td className="border-0">1</td>
                                                <td className="border=0">
                                       
                                                    <div className="d-flex">
                                                        <img src={image6} style={{width:'50px', height:'50px'}} alt="ima"/>
                                                        <div className="align-self-center-pl-3">
                                                            <span className="font-weight-bold">Pierce Taylor</span>
                                                        </div>
                                                    </div>
                                                    </td>
                                        <td className="border-0">
                                            <b>100</b>
                                        </td>
                                    </tr>
                                        
                                </tbody>
                            </table>

                        </div>

                    </div>

                </div>
              
            </ModalContent>
            <CloseModalButton onClick={props.click}/>
          </ModalWrapper>
        </Background>
  );  
}




export default RankingsModal;