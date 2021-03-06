package jobApplicationApp.dto.form;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Form for retrieving user information
 *
 * @author Adrian Gortzak gortzak@kth.se
 */
@Getter
@NoArgsConstructor
public class PersonForm {

    @JsonIgnore
    private int id;

    /**
     * The first name of the user
     * @return first name
     */
    private String firstName;


    /**
     * The last name of the user
     * @return last name
     */
    private String lastName;


    /**
     * The user's date of birth
     * return date of birth
     */
    private Date dateOfBirth;


    /**
     * The user's email address
     * @return email address
     */
    private String email;

    /**
     * The role the user has on the site
     * @return The user's role
     */
    private RoleForm role;

    /**
     * Constructor without competences
     * @param firstName
     * @param lastName
     * @param dateOfBirth
     * @param email
     * @param role
     */
    public PersonForm(String firstName, String lastName, Date dateOfBirth, String email, RoleForm role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.role = role;
    }


}
