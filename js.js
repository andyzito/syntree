$(document).ready(function() {
    var init = {
        save_tree_script:"/post/save-tree.php",
        export_tree_script:"/post/export-tree.php",
        focus_checking_enabled:true
    };

    W = new Workspace(0,init)

    function create_account() {
        var username = $('.modal_option__new-username input').val();
        var password = $('.modal_option__new-password input').val();

        $.post("post/new-user.php", {username: username, password: password}, function(result) {
            alert(result);
        });
        modal_close($('.modal_body.modal_create-account').attr('with-overlay'));
    }

    function logout() {
        $.post('post/logout.php',{},function(){
            $.post('post/rerender.php',{renderid: 'navbar'},function(content) {
                $('.navbar_main').html(content);
            });
        });
    }

    function login() {
        var username = $('.modal_option__username input').val();
        var password = $('.modal_option__password input').val();

        $.post("post/login.php", {username: username, password: password}, function(result) {
            alert(result);
            $.post('post/rerender.php',{renderid:'navbar'},function(content){
                $('.navbar_main').html(content)
            });
        });
        modal_close($('.modal_body.modal_login').attr('with-overlay'));
        $('.modal_body.modal_login input').val('');
    }

    $(document).on('keypress','.modal_body.modal_login input[type=password]',function(e){
        if (e.keyCode === 13) {
            login();
        }
    });
    $(document).on('keypress','.modal_body.modal_create-account input[type=password]',function(e){
        if (e.keyCode === 13) {
            create_account();
        }
    });
    $(document).on('click', '.modal_button__create-account', function(){create_account()});
    $(document).on('click', '.modal_button__login', function() {login()});
    $(document).on('click', '.navbar_link__logout', function() {logout()});
});