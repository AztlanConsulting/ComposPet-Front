import '../../css/Template/error.css';
import '../../css/Template/unauthorizedPage.css';
import Error from '../../components/Template/error';

function UnauthorizedPage(){

    return(
        <main className="background">
            <Error message="No tienes permisos para acceder a esta página." />
        </main>
    );   
}

export default UnauthorizedPage;