<?php
class comprobarCorreo
{
    private $exception = null; //id de empleado
    public function checkEmail($email)
    {
        // Initialize cURL.
        $ch = curl_init();

        // Set the URL that you want to GET by using the CURLOPT_URL option.
        curl_setopt($ch, CURLOPT_URL, 'https://emailvalidation.abstractapi.com/v1/?api_key=e32057c5fb1f481d91d1b3b51e666b78&email='.$email);

        // Set CURLOPT_RETURNTRANSFER so that the content is returned as a variable.
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Set CURLOPT_FOLLOWLOCATION to true to follow redirects.
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        // Execute the request.
        $data = curl_exec($ch);
        // Close the cURL handle.
        curl_close($ch);

        // Print the data out onto the page.
        $arreglo = json_decode($data, true);//Decodificamos el JSON y lo volvemos un arreglo
        $desechable = ($arreglo['is_disposable_email']['text']);//Obtenemos el valor si es desechable
        $disponible = ($arreglo['is_smtp_valid']['text']);//Obtenemos el valor si esta disponible para enviar
        if ($desechable == 'FALSE' && $disponible == 'FALSE') {
            return false;
        }else{
            return true;
        }
    }
}
