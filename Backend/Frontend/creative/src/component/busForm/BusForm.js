import BusButton from "./BusButton";
import BusInput from "./BusInput";
import styled from "styled-components";
import axios from "axios"

const StyledForm = styled.form`
    display:flex;
    width: 735px;
    height: 98px;
    border: 4px solid #CDD029
`


const BusForm = () => {
    const SubmitBusStation = (value) => {
        axios.get(`/station/${value}`, {

        }).then(res => {
            const { data } = res;
            console.log(data)

        }).catch(error => {
            alert("데이터를 받아오지 못했습니다.")
        });

    }
    const BusStationData = (event) => {
        event.preventDefault();
        const { target: [input] } = event
        const { value } = input
        input.value = "";
        SubmitBusStation(value)
    }
    return (
        <StyledForm onSubmit={BusStationData}>
            <BusInput />
            <BusButton />
        </StyledForm>
    )
}

export default BusForm