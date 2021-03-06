<?php
namespace fibe\ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use fibe\CommunityBundle\Entity\Person;
use fibe\EventBundle\Entity\MainEvent;
use fibe\EventBundle\Entity\VEvent;
use fibe\ImportBundle\Annotation\Importer;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\MaxDepth;
use JMS\Serializer\Annotation\SerializedName;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * The Role entity
 *
 * @ORM\Table(name="role")
 * @ORM\Entity(repositoryClass="fibe\ContentBundle\Repository\RoleRepository")
 *
 *  Don't seem to work with ajax form
 * @UniqueEntity(
 *     fields={"person", "event","roleLabel"},
 *     errorPath="role",
 *     message="This person has already this role at this event"
 * )
 * @ORM\HasLifecycleCallbacks
 * @ExclusionPolicy("all")
 */
class Role
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @Expose
     * @Groups({"list"})
     */
    private $id;

    /**
     * label
     * @ORM\Column(type="string", name="label", nullable=false)
     *
     * @Expose
     * @Groups({"list"})
     */
    private $label;


    /**
     * importCode used to easily make link between entities during data import
     * @ORM\Column(type="string", nullable=true)
     * @Importer
     */
    private $importCode;

    /**
     * Person : the person who has this role
     *
     * @ORM\ManyToOne(targetEntity="fibe\CommunityBundle\Entity\Person", inversedBy="roles")
     *
     * @Assert\NotNull(message = "{'field' : 'persons', 'msg' : 'roles.validations.person_required'}")
     *
     * @Expose
     * @Groups({"list"})
     * @MaxDepth(2)
     *
     * @Importer(optional=false, uniqField="email", targetEntity="fibe\CommunityBundle\Entity\Person")
     */
    private $person;

    /**
     * The mainEvent associated
     *
     * @ORM\ManyToOne(targetEntity="fibe\EventBundle\Entity\MainEvent", inversedBy="roles", cascade={"persist"})
     * @ORM\JoinColumn(referencedColumnName="id")
     * @Assert\NotNull(message = "{'field' : 'mainEvents', 'msg' : 'roles.validations.main_event_required'}")
     * @Expose
     * @Groups({"list"})
     * @MaxDepth(1)
     * @SerializedName("mainEvent")
     */
    private $mainEvent;

    /**
     * @ORM\ManyToOne(targetEntity="fibe\ContentBundle\Entity\RoleLabel", inversedBy="roles")
     * @ORM\JoinColumn(name="roleLabelId", referencedColumnName="id")
     *
     * @Assert\NotBlank(message = "{'field' : 'roleLabels', 'msg' : 'roles.validations.role_label_required'}")
     *
     * @Expose
     * @SerializedName("roleLabel")
     * @Groups({"list"})
     * @MaxDepth(2)
     *
     * @Importer(optional=false, uniqField="label", create=true, targetEntity="fibe\ContentBundle\Entity\RoleLabel")
     */
    private $roleLabel;

    /**
     * @ORM\ManyToOne(targetEntity="fibe\EventBundle\Entity\Event", inversedBy="roles")
     *
     * @Expose
     * @Groups({"list"})
     * @MaxDepth(2)
     *
     * @Importer(targetEntity="fibe\EventBundle\Entity\Event")
     */
    private $event;

    /**
     *
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function computeLabel()
    {
        $eventLabel = $this->getEvent() ? $this->getEvent()->getLabel() : $this->getMainEvent()->getlabel();
        $this->setLabel(sprintf("%s is %s at %s",
            $this->getPerson()->getLabel(),
            $this->getRoleLabel()->getlabel(),
            $eventLabel

        ));
    }

    /**
     * Get event
     *
     * @return VEvent
     */
    public function getEvent()
    {
        return $this->event;
    }

    /**
     * Set event
     *
     * @param \fibe\EventBundle\Entity\VEvent $event
     *
     * @internal param \fibe\EventBundle\Entity\VEvent $event
     *
     * @return Role
     */
    public function setEvent(VEvent $event = null)
    {
        $this->event = $event;

        return $this;
    }

    /**
     * Get mainEvent
     *
     * @return MainEvent
     */
    public function getMainEvent()
    {
        return $this->mainEvent;
    }

    /**
     * Set mainEvent
     *
     * @param MainEvent $mainEvent
     *
     * @return Role
     */
    public function setMainEvent(MainEvent $mainEvent)
    {
        $this->mainEvent = $mainEvent;

        return $this;
    }

    /**
     * Get person
     *
     * @return Person
     */
    public function getPerson()
    {
        return $this->person;
    }

    /**
     * Set person
     *
     * @param Person $person
     *
     * @return Role
     */
    public function setPerson(Person $person = null)
    {
        $this->person = $person;

        return $this;
    }

    /**
     * @return RoleLabel
     */
    public function getRoleLabel()
    {
        return $this->roleLabel;
    }

    /**
     * @param RoleLabel $roleLabel
     */
    public function setRoleLabel(RoleLabel $roleLabel)
    {
        $this->roleLabel = $roleLabel;
    }

    /**
     * Get type
     *
     * @return String
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * Set type
     *
     * @param String $label
     *
     * @return String
     */
    public function setLabel($label)
    {
        $this->label = $label;

        return $this;
    }

    public function __toString()
    {
        return $this->label;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    public function getImportCode()
    {
        return $this->importCode;
    }

    public function setImportCode($code)
    {
        $this->importCode = $code;
    }
}