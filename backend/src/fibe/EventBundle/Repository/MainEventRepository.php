<?php

namespace fibe\EventBundle\Repository;

/**
 * MainEventRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 *
 */
class MainEventRepository extends VEventRepository
{
    /**
     * filtering with all parameters difned
     * @param $qb , query builder to add the filter to
     * @param $params , the field to filter on
     * @return $qb, modified query builder
     */
    public function filter($qb, $params)
    {
        return $qb;
    }
}