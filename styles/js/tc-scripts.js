
$('#modal-tutorial-inicio').modal('show')

$('.mostrar_tour').on('click',function(e){
    e.preventDefault();
    $('#modal-tutorial-inicio').modal('hide');

    var enjoyhint_instance = new EnjoyHint({});
    var enjoyhint_script_steps = [
        {
            'next .edufair-cart' : 'Inicia Sesion y/o Registrate.',
            'nextButton' : {className: "myNext", text: "Siguiente"},
            // 'skipButton' : {className: "mySkip", text: "Omitir"},
            showSkip: false
        },
        {
            'next .buscar_gn' : 'Busca Bines, Servicios, Liquidaciones & RR.HH.',
            'nextButton' : {className: "myNext", text: "Siguiente"},
            showSkip: false
        },
        {
            'next .course-description-nav' : 'Tambien puedes buscarlo por separado.',
            'nextButton' : {className: "myNext", text: "Siguiente"},
            showSkip: false
        },
        {
            'next .table_bienes' : 'Verifica tu resultado o revisa otros requerimientos.',
            'nextButton' : {className: "myNext", text: "Siguiente"},
            showSkip: false
        },
        {
            'click .btn_ver_detalles' : 'Puedes ver detalles del requerimiento y si desea puede ofertar.',
            'skipButton' : {className: "mySkip", text: "Finalizar"},
        }
    ];
    enjoyhint_instance.set(enjoyhint_script_steps);
    enjoyhint_instance.run();
        
})
