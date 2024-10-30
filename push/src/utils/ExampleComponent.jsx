import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TitleAction } from "../redux/actions/TitleAction";
import { getTitle } from "../services/TitleService";

/*
This Component page is only for demo purpose in this we have make use of useDispatch(),useSelector
*/

const ExampleComponent = () => {
    const dispatch = useDispatch();
    const title = useSelector((state) => state.title.title);

    useEffect(() => {
        loadData();
    });

    const loadData = async () => {
        const response = await getTitle();
        dispatch(TitleAction(response.data));
    };

    return <div>Welcome {title}</div>;
}

export default ExampleComponent;
