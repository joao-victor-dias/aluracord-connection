import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import appConfig from "../config.json";
import React from "react";
import {useRouter} from "next/router";
import Fundo from "../img/Fundo.png"


function Titulo(props) {
    console.log(props.children);
    const Tag = props.tag || "h1";
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
        </>
    );
}

// //componente react
// function PaginaInicial() {
//     return(
//         <div>
//             <GlobalStyle/>
//             <Titulo tag="h1">Boas vindas de volta!</Titulo>
//             <h2>Discord - Alura Matrix</h2>
//         </div>
//     )
// }

// export default HomePage

export default function PaginaInicial() {
    //const username = "joao-victor-dias";
    const [username, setUsername] = React.useState('joao-victor-dias');
    const roteamento = useRouter();
    

    return (
        <>
            
            <Box
                styleSheet={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: appConfig.theme.colors.primary[600],
                    backgroundImage:`url(${Fundo.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundBlendMode: "multiply",
                }}
            >
                <Box
                    styleSheet={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        width: "100%",
                        maxWidth: "700px",
                        borderRadius: "5px",
                        border: "3px solid",
                        borderColor:"#000",
                        padding: "32px",
                        margin: "16px",
                        boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                        backgroundColor: 'rgba( 0, 0, 212, 0.15 )',
                        //backgroundColor: appConfig.theme.colors.neutrals[800],
                        backdropFilter: 'blur( 1px )'
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit = {function (infosDoEvento) {
                            infosDoEvento.preventDefault();
                            console.log("Alguém submeteu o form")
                            roteamento.push(`/chat?username=${username}`);
                            //window.location.href = "/chat";
                        }}
                        styleSheet={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: { xs: "100%", sm: "50%" },
                            textAlign: "center",
                            marginBottom: "32px",
                        }}
                    >
                        <Titulo>Boas vindas de volta!</Titulo>
                        <Text
                            variant="body3"
                            styleSheet={{
                                marginBottom: "32px",
                                color: appConfig.theme.colors.neutrals[100]
                            }}
                        >
                            {appConfig.name}
                        </Text>

                        {/* <input 
                            type = "text"
                            value= {username}
                            onChange={function handler(event) {
                                console.log('Usuário digitou', event.target.value);
                                //onde ta o valor?
                                const valor = event.target.value;
                                //trocar o valor do usuario
                                
                                setUsername(valor);
                            }}
                        /> */}

                        <TextField
                            
                            value={username}                            
                            onChange={function handler(event) {
                                console.log('Usuário digitou', event.target.value);
                                //onde ta o valor?
                                const valor = event.target.value;                                                           
                                //trocar o valor do usuario                                                            
                                setUsername(valor.length > 2 ? `${valor}` : null);                                
                            }}
                            fullWidth
                            placeholder="Username Github"
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[100],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[999],
                                    backgroundColor: 'rgba( 0, 0, 0, 0.80 )',
                                    
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            label="Entrar"
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[999],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[800],
                                
                            }}
                        />
                    </Box>
                    {/* Formulário */}

                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",

                            maxWidth: "200px",
                            padding: "16px",
                            backgroundColor: 'rgba( 15, 0, 111, 0.90 )',
                            border: "2px solid",
                            borderColor: '#000',
                            borderRadius: "10px",
                            flex: 1,
                            minHeight: "240px",
                        }}
                    >
                        <Image
                            styleSheet={{
                                border:'2px solid',
                                borderColor:'#000',
                                borderRadius: "10%",
                                marginBottom: "16px",
                            }}
                            src={`https://github.com/${username}.png`}
                        />                        
                        <Text                            
                            variant="body4"
                            styleSheet={{                                
                                color: appConfig.theme.colors.neutrals[100],
                                backgroundColor: '#000',
                                padding: "3px 40px",
                                borderRadius: "10px"                                                                  
                            }}                                
                        >
                            {username}
                        </Text>                       
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}
