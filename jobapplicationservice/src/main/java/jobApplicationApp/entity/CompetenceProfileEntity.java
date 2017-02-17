package jobApplicationApp.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "competence_profile")
@NoArgsConstructor
@Getter
public class CompetenceProfileEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;

    @ManyToOne
    @JsonIgnore
    private ApplicationEntity application;

    @OneToOne
    @JoinColumn(name = "competence_id")
    private CompetenceEntity competence;

    private int years_of_experience;


    public CompetenceProfileEntity(ApplicationEntity application, CompetenceEntity competence, int yearsOfExperience) {
        this.application = application;
        this.competence = competence;
        this.years_of_experience = yearsOfExperience;
    }
}
